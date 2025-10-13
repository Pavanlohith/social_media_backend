const mongoose=require('mongoose');
const cmntschema=new mongoose.Schema({
    ID:String,
    userid:String,
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