const mongoose=require('mongoose')
const postschema=new mongoose.Schema({
    ID:String,
    userid:String,
    caption:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        required:true
    },
    "created_date":{
        type:Date,
        required:true
    }

})
module.exports=mongoose.model("post",postschema)