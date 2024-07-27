const mongoose=require('mongoose');

mongoose.pluralize(null); // make sure that MongoDB do NOT interfere in my names

const UserSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Email:String,         
    Password:String,      
});

//---------------------- export ----------------------------
module.exports=mongoose.model("user",UserSchema); // the name of the "document"