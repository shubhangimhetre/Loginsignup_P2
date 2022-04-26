const express=require('express')
const router=express.Router()
const web1=require('../controllers/loginsignup')
const web2=require('../controllers/loginsignup2')
const web3=require('../controllers/loginsignup3')
const verify=require('../verifytoken');


//Authentication by otp verification 

router.get('/all',web1.get_all)

router.post('/register',web1.user_register)

router.patch('/verify',verify,web1.verify_otp)
 
router.post('/login',verify,web1.user_login)

router.patch('/resend_otp',web1.resend_otp)


//Authentication by Google authenticator

router.get('/all',web2.get_all)

router.post('/register2',web2.user_register)

router.patch('/verify2',verify,web2.user_verify)

router.post('/login2',verify,web2.user_login)




//Authentication by Authy
router.get('/all3',web3.get_all)
// router.get('/sms',web3.get_sms)

router.post('/register3',web3.user_register)

router.patch('/verify3',web3.user_verify)

router.post('/login3',web3.user_login)


module.exports=router