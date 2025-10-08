const mongoose=require('mongoose');
const cmntschema=new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    postid:String,

    "commented_date":{
        type:Date
    }
})
module.exports=mongoose.model("Comment",cmntschema)