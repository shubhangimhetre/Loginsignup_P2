const mongoose=require('mongoose')
// const DB='mongodb+srv://shubhangimhetre:<password>@cluster0.92lj6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
Schema = mongoose.Schema;


var userSchema = new Schema({
    name: { type: String, trim: true, required: true,max:70 },
    email: { type: String, unique: true, lowercase: true, trim: true,required:true },
    password:{ type: String, unique: true,required: true},
    otp :{type:Number},
    activation:{type:Boolean}
},{timestamps:true});



module.exports=mongoose.model('user',userSchema)
