
const express=require('express');
const app=express();
const port=3000;
const bodyparser=require('body-parser');
const mongoose=require('mongoose')
const cookies=require('cookies')
const cookieParser=require('cookie-parser')
// const DB="mongodb+srv://shubhangimhetre:Shubhangi_123@cluster0.92lj6.mongodb.net/Project2?retryWrites=true&w=majority"
const DB="mongodb+srv://shubhangimhetre:Shubhangi_123@cluster0.mfi9y.mongodb.net/Project2?retryWrites=true&w=majority"
const session = require('express-session');

const web1=require('./routes/user_routes')


app.use(session({secret: 'shubhangimhetre',saveUninitialized: true,resave: true}));
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cookieParser())

mongoose.connect(DB, {
    // useCreatIndex: true, 
    // useFindAndModify: false, 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    }).then(()=>{console.log('connected to database..') })
    .catch((err)=>{ console.log(err)})

app.get('/',(req,res)=>{
    res.send('Hello world')
})

//Authentication by otp verification
app.use('/user',web1)



app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})