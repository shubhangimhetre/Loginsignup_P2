const mongoose=require('mongoose')
const user=require('../model/usermodel')
const {registerValidation,loginValidation}=require('../validate')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
var nodemailer = require('nodemailer');
// var activation;
var email;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubhangi.mhetre551832@gmail.com',
      pass: 'Shubhangi@123'
    }
  });

exports.get_all=async(req,res)=>{
    const found=await user.find()
    res.send(found)
}

exports.user_register=async(req,res)=>{
    const {error}=await registerValidation(req.body)
    if (error){
        return res.status(400).send(error.details[0].message);
    }else{
        var otp = parseInt(Math.random() * 1000000);
        // console.log(otp);
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(req.body.password,salt)  //hash password
        const found=await user.findOne({email:req.body.email})   
        if(found!=null){
            res.send('This email is already registered please try with another email')
        }else{      
            try{
                token = jwt.sign({email:req.body.email},"iamshubhangi",{expiresIn:"6hr"})
                res.cookie("user",token)
                email=req.body.email;
                var mailOptions={
                    from:'shubhangivm7171@gmail.com',
                    to:email,
                    subject: "Otp for registration is: ",
                    html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
                };
                transporter.sendMail(mailOptions, async(error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);   
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    const user_data=new user({"name":req.body.name,"email":req.body.email,"password":hashedPassword,"otp":otp,"activation":false})
                    const user1=await user_data.save()
                    activation=false
                    console.log(user1)
                    res.json({error:false,message:"Otp is sent to your email.. please verify",data:user1.email})
                });
                
            }catch(err){res.send(err)}
        }
    }   

}

exports.verify_otp=async(req,res)=>{
    const found=await user.findOne({otp:req.body.otp})
    if(found!=null){
        await found.updateOne({activation:true})
        const updateduser1=await user.findOne({otp:req.body.otp})
        res.json({error: false,message:"You has been successfully registered and your account is activated.",data:updateduser1});
    }
    else{
        res.render('otp',{msg : 'otp is incorrect'});
        activation=false
    }

}

exports.resend_otp=async(req,res)=>{
    var otp = parseInt(Math.random() * 1000000);
    // console.log(otp);
    var mailOptions={
        from:'shubhangivm7171@gmail.com',
        to:email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
    };
    transporter.sendMail(mailOptions, async(error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // console.log(user1)
        const found=await user.findOne({email:email})
        await found.updateOne({otp:otp})
        const updateduser1=await user.findOne({email:email})
        res.json({error:false,message:"Otp is sent to your email.. please verify",data:updateduser1.email})
        activation=true
    });
 
}

exports.user_login=async(req,res)=>{
    const {error1}=await loginValidation(req.body);
    if (error1){
        console.log(error1);
        return res.status(400).send(error.details[0].message);
    }else{
        const data=await user.findOne({email:req.body.email})
        
        
       if(data.activation==true){
            try{
                // const data=await user.findOne({email:req.body.email})
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

