const express=require('express');
const app=express();
const mongoose=require('mongoose')
require('dotenv').config();
const session = require('express-session');
const web1=require('./routes/user_routes');


app.use(session({secret: process.env.session_secret,saveUninitialized: true,resave: true}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


mongoose.connect(process.env.db_connect, {useNewUrlParser: true})
.then(()=>{console.log('connected to database..'); })
.catch((err)=>{ console.log(err);})


app.use('/user',web1);

app.listen(3000,()=>{console.log("Server listening..");})







