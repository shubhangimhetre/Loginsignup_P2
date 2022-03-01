const mongoose=require('mongoose');
const user2=require('../model/usermodel2')
const {registerValidation,loginValidation}=require('../validate')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const speakeasy=require('speakeasy')
const uuid=require('uuid')
var verified;

exports.get_all=async(req,res)=>{
    const found=await user2.find()
    res.send(found)
}


exports.user_register=async(req,res)=>{
    const {error}=await registerValidation(req.body)
    if (error){
        return res.status(400).send(error.details[0].message);
    }else{
        const salt=await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(req.body.password,salt)  //hash password
        const found=await user2.findOne({email:req.body.email})   
        if(found!=null){
            res.send('This email is already registered please try with another email')
        }else{      
            try{     
                token = jwt.sign({email:req.body.email},"iamshubhangi",{expiresIn:"6hr"})
                res.cookie("user",token)
                const id= uuid.v4()
                const temp_secret=speakeasy.generateSecret()

                const user2_data= new user2({"name":req.body.name,"email":req.body.email,"password":hashedPassword,"id":id,"temp_secret":temp_secret})
                console.log(user2_data)
                const user_data2=await user2_data.save()
                res.json({error:false,message:"User is registered",data:user_data2})
            }catch(err){res.send(err)}
        }
    }
}

exports.verify_user=async(req,res)=>{
    const {id,token}=req.body;
    try{
        const found=await user2.findOne({id:id}) 
        const {base32:secret}=found.temp_secret;
        // console.log(secret)
        var verified=speakeasy.totp.verify({
            secret,
            encoding:'base32',
            token,
        });
        if(verified){
            res.json({verified:true})
        }else{
            res.json({verified:false})
        }
    }catch(err){res.send(err) }
}



exports.user_login=async(req,res)=>{
    const {error1}=await loginValidation(req.body);
    if (error1){
        console.log(error1);
        return res.status(400).send(error.details[0].message);
    }else{
            try{
                const data=await user2.findOne({email:req.body.email})
                const validPass=await bcrypt.compare(req.body.password,data.password)
                // console.log(validPass)
                if(validPass){
                    res.json({error:false,message:"login successfully..",data:data})
                }else{
                    res.json({error :true,message:"Email or password is wrong. data not found"})
                }
            }catch(err){res.send(err)}
    }
}
