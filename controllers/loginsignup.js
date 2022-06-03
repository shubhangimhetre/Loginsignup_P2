
//******Authentication by otp verification******

const user = require('../model/usermodel');
const { registerValidation, loginValidation } = require('../validate');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var newOTP = require('otp-generators');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

exports.get_all = async (req, res) => {
    const found = await user.find();
    res.status(200).send(found);
}

exports.user_register = async (req, res) => {
    const { error } = await registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var otp = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const found = await user.findOne({ email: req.body.email });
    if (found != null) return res.send('This email is already registered please try with another email');

    try {
        var mailOptions = {
            from: process.env.email,
            to:req.body.email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) return res.status(400).send(error);
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            const user_data = new user({ 
                "name": req.body.name, 
                "email": req.body.email, 
                "password": hashedPassword, 
                "otp": otp, 
                "activation": false 
            })
            await user_data.save();

            res.status(200).send("Otp is sent to your email.. please verify");
        });

    } catch (err) { res.status(400).send(err); }
}

exports.verify_otp = async (req, res) => {
    const found = await user.findOne({ otp: req.body.otp });
    if (found == null) return res.send('otp is incorrect');

    await found.updateOne({ activation: true });
    res.status(200).send("You has been successfully registered and your account is activated.");

}

exports.resend_otp = async (req, res) => {

    var otp = newOTP.generate(6, { alphabets: false, upperCase: false, specialChar: false });
    var email=req.query.email;

    var mailOptions = {
        from: process.env.email,
        to: email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };
    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) return res.status(400).send(error);

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        const found = await user.findOne({ email: email });
        await found.updateOne({ otp: otp,activation:false});
        res.status(200).send("Otp is sent to your email.. please verify");

    });
}

exports.user_login = async (req, res) => {
    const { error1 } = await loginValidation(req.body);
    if (error1) return res.status(400).send(error1.details[0].message);

    const data = await user.findOne({ email: req.body.email });
    if(data==null) return res.send("user data not found")

    if (!(data.activation)) return res.send('You have not done otp verification');

    const validPass = await bcrypt.compare(req.body.password, data.password);
    if (!validPass) return res.send("Email or password is wrong. data not found");

    res.status(200).send("Logged in successfully..");
}

