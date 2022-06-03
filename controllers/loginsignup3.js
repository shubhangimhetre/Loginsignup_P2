//******Authentication using Authy******

const User = require('../model/usermodel3');
const { registerValidation, loginValidation } = require('../validate');
const bcrypt = require('bcryptjs');
const authy = require('authy')(process.env.api_key);


exports.get_all = async (req, res) => {
    const found = await User.find();
    res.status(200).send(found);
}


exports.user_register = async (req, res) => {
    const { error } = await registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const found = await User.findOne({ email: req.body.email });
    if (found != null) return res.send('This email is already registered please try with another email');

    const user = new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        mobile: req.body.mobile,
        countryCode: req.body.countryCode
    });


    console.log('In Registration...');
    authy.register_user(req.body.email, req.body.mobile, req.body.countryCode, async function (regErr, regRes) {
        if (regErr) return res.status(400).send(regErr);
        
        await user.set('authyID', regRes.user.id);
        const user2 = await user.save();
        const session = req.session;
        session.user = user2;
        var username = req.session.user.name;

        const user3 = await User.findOne({ name: username });
        await user.save();

        await authy.request_sms(user3.authyID, force = true, function (smsErr, smsRes) {
            if (smsErr) return res.status(400).send(smsErr)
            res.send(smsRes)
        });

    });



}




exports.user_verify = async (req, res) => {
    const { authyID, token } = req.body;

    await authy.verify(authyID, token, async function (verifyErr, verifyRes) {
        if (verifyErr) return res.status(400).send(verifyErr);
        if (!verifyRes.success) return res.send("Verification failed..");

        const found = User.findOne({ authyID: authyID });
        await found.updateOne({ activation: true });
        res.status(200).send("You has been successfully registered and your account is activated.");
    })
}



exports.user_login = async (req, res) => {

    const { error1 } = await loginValidation(req.body);
    if (error1) return res.status(400).send(error1.details[0].message);


    const data = await User.findOne({ email: req.body.email });
    if (!(data.activation)) return res.status(400).send('You have not done otp verification');

    const validPass = await bcrypt.compare(req.body.password, data.password);
    if (!validPass) return res.status(400).send("Email or password is wrong. data not found");

    res.status(200).send("Logged in successfully..");

}


