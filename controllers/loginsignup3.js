//Authentication using Authy

const User = require('../model/usermodel3')
const { registerValidation, loginValidation } = require('../validate')
const bcrypt = require('bcryptjs')
const authy = require('authy')('SNyHP99Dg8tf1n6iSK1I7djf0vxCJEKn')


exports.get_all = async (req, res) => {
    const found = await User.find()
    res.send(found)
}


exports.user_register = async (req, res) => {
    const { error } = await registerValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)  //hash password
        const found = await User.findOne({ email: req.body.email })
        if (found != null) {
            res.send('This email is already registered please try with another email')
        } else {
            user = new User({
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
                mobile: req.body.mobile,
                countryCode: req.body.countryCode
            });
            user.save(function (err) {
                console.log('In Registration...');
                authy.register_user(req.body.email, req.body.mobile, req.body.countryCode, async function (regErr, regRes) {
                    if (regErr) {
                        console.log(regErr)
                    } else {
                        // console.log(regRes)
                        user.set('authyID', regRes.user.id)
                        const user2 = await user.save()
                        const session = req.session
                        session.user = user2
                        var username = req.session.user.name;
                        const user3 = await User.findOne({ name: username })
                        await authy.request_sms(user3.authyID, force = true, function (smsErr, smsRes) {
                            if(smsErr){console.log(smsErr)}
                            console.log(smsRes);
                            res.send(smsRes)
                        });
                    }
                });
            });   
        }
    }
}




exports.user_verify = async (req, res) => {
    const { authyID, token } = req.body;
    await authy.verify(authyID, token,async function (verifyErr, verifyRes) {
        if (verifyErr) { console.log(verifyErr) }
        // console.log(res);
        if (verifyRes.success) {
            // console.log(verifyRes);
            const found = User.findOne({ authyID: authyID })
            await found.updateOne({ activation: true })
            const updateduser1 = await User.findOne({ authyID: authyID })
            console.log(updateduser1)
            console.log({ error: false, message: "You has been successfully registered and your account is activated.", data: verifyRes });
            res.send({ error: false, message: "You has been successfully registered and your account is activated.", data: verifyRes });
        } else {
            console.log("Verification failed..")
            res.send("Verification failed..")
        }  
    })
}



exports.user_login = async (req, res) => {
    const { error1 } = await loginValidation(req.body);
    if (error1){
        console.log(error1);
        return res.status(400).send(error.details[0].message);
    }else{
        const data=await User.findOne({email:req.body.email})
        if(data.activation==true){
            try{
                const validPass=await bcrypt.compare(req.body.password,data.password)
                // console.log(validPass)
                if(validPass){
                    res.json({error:false,message:"login successfully..",data:data})
                }else{
                    res.json({error :true,message:"Email or password is wrong. data not found"})
                }
            }catch(err){res.send(err)}
       }else{res.send('You have not done otp verification')}
    }

}