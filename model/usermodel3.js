const { string } = require('@hapi/joi');
const mongoose=require('mongoose');

var userSchema3 =mongoose.Schema({
    name: { type: String, trim: true, required: true,max:70 },
    email: { type: String, unique: true, lowercase: true, trim: true,required:true },
    password:{ type: String, unique: true,required: true},
    mobile:{type:String,required:true},
    countryCode:{type:String},
    authyID:{type:String,required:true},
    activation:{type:Boolean}    
},{timestamps:true});


module.exports=mongoose.model('user3',userSchema3);