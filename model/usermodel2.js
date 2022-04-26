const mongoose=require('mongoose')
// const DB='mongodb+srv://shubhangimhetre:<password>@cluster0.92lj6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
Schema = mongoose.Schema;

var userSchema2 = new Schema({
    name: { type: String, trim: true, required: true,max:70 },
    email: { type: String, unique: true, lowercase: true, trim: true,required:true },
    password:{ type: String, unique: true,required: true},
    id:{type:String,unique:true,required:true},
    temp_secret:{type:Object},
    activation:{type:Boolean}
    
},{timestamps:true});

module.exports=mongoose.model('user2',userSchema2)