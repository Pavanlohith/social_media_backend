const mongoose=require('mongoose')
const userschema=new mongoose.Schema({
    "ID":String,
    "username":{
        type:String,
        required:true
    },
    "email":{
         type:String,
        required:true
    },
    "password":{
         type:String,
        required:true
    },
    "created_date":{
         type:Date,
        required:true
    },

})
module.exports=mongoose.model('user',userschema)