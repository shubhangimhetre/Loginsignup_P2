const express=require('express')
const router=express.Router()
const web2=require('../controllers/loginsignup2')
const verify=require('../verifytoken');

router.get('/all',web2.get_all)

router.post('/register',web2.user_register)

router.post('/verify',verify,web2.verify_user)

router.post('/login',verify,web2.user_login)


module.exports=router