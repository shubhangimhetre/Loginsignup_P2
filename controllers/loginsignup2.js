
//*****Authentication by Google authenticator******

const user2 = require('../model/usermodel2');
const { registerValidation, loginValidation } = require('../validate');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const uuid = require('uuid');


exports.get_all = async (req, res) => {
    const found = await user2.find();
    res.status(200).send(found);
}


exports.user_register = async (req, res) => {
    const { error } = await registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const found = await user2.findOne({ email: req.body.email });
    if (found != null) return res.send('This email is already registered please try with another email');
    const id = uuid.v4();

    const temp_secret = speakeasy.generateSecret();
    const user2_data = new user2({ 
        "name": req.body.name, 
        "email": req.body.email, 
        "password": hashedPassword, 
        "id": id, 
        "temp_secret": temp_secret, 
        "activation": false 
    });

    await user2_data.save();
    res.status(200).send("user registered,please verify your account..");

}

exports.user_verify = async (req, res) => {

    const { id, token } = req.body;

    try {
        const found = await user2.findOne({ id: id });
        const { base32: secret } = found.temp_secret;

        var verified =await speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
        });

        if (!verified) return res.send("Not verified.");

        await found.updateOne({ activation: true });
        res.status(200).send("You has been successfully registered and your account is activated.");

    } catch (err) { res.status(400).send(err); }
}



exports.user_login = async (req, res) => {

    const { error1 } = await loginValidation(req.body);
    if (error1) return res.status(400).send(error1.details[0].message);

    const data = await user2.findOne({ email: req.body.email })
    if (!(data.activation)) return res.status(400).send('You have not done otp verification');

    const validPass = await bcrypt.compare(req.body.password, data.password);
    if (!validPass) return res.status(400).send("Email or password is wrong. data not found");

    res.status(200).send("Logged in successfully..");

}



