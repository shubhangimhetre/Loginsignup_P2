const express=require('express')
const router=express.Router()
const web1=require('../controllers/loginsignup')
const verify=require('../verifytoken');

router.get('/all',web1.get_all)

router.post('/register',web1.user_register)

router.post('/verify',verify,web1.verify_otp)

router.post('/login',verify,web1.user_login)

router.get('/resend_otp',web1.resend_otp)


module.exports=router