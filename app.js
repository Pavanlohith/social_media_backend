const express=require('express')
const app=express()
const connectDB=require("./db/db.js")
const jwt=require('jsonwebtoken')
const post=require("./models/post.js")
const middleware=require("./middleware.js")
const Comment = require("./models/comment.js")


const { v4: uuidv4 } = require('uuid');
const user=require("./models/user.js")
const comment = require('./models/comment.js')
connectDB();
app.use(express.json())
//user routes
app.post("/api/user/register",async(req,res)=>{
    const{username,email,password,created_date}=req.body;
    const exist=await user.findOne({email});
    if(exist){
        res.send("user already exists")
    }
    const usersschema=new user({
        ID:uuidv4(),
        username,
        email,
        password,
        created_date
    })
    const info=await usersschema.save();
    res.send(info)
}),
app.post("/api/user/login",async(req,res)=>{
   try{
    const {email,password}=req.body;
    const exist=await user.findOne({email})
    if(!exist){
        return res.send("user doeant exits")
    }
    const payload={
        user:{
            id:exist._id
        }
    }
    jwt.sign(payload,"jwtsecret",{expiresIn:"9h"},(err,token)=>{
        if(err) {
            throw err
        }
        return res.json({token})
    })
}
catch(e)
{
    res.send(e);
}
})
app.get("/api/user/profile",middleware,async(req,res)=>{
    try{
            const exist=await user.findById(req.user.id)
            return res.json({exist})
    }
    catch(e){
        res.send(e);
    }
})
//post part
app.post("/api/posts",async(req,res)=>{
    const{userid,caption,likes,created_date}=req.body;
    const newpost=new post({
        ID:uuidv4(),
        userid,
        caption,
        likes,
        created_date
    })
    const info=await newpost.save();
    res.send(info)
})
app.get("/api/posts",async(req,res)=>{
    try{
           const resp=await post.find();
           res.send(resp)
    }
    catch(e){
        res.send(e)
    }
})
app.get("/api/posts/:id",async(req,res)=>{
    const id=req.params.id;
    const x=await post.findOne({"userid":id});
    res.send(x);

})
app.patch("/api/posts/likes/:id",async(req,res)=>{
    const id=req.params.id;
     const x=await post.findOneAndUpdate({"userid":id},req.body);
     res.send(x);

})
app.delete("/api/posts/:id",async(req,res)=>{
      const id=req.params.id;
     const x=await post.findOneAndDelete({"userid":id});
     res.send(x);

})
//comment part
app.post("/api/comment",async(req,res)=>{
    const{postid,comment,commented_date}=req.body;
    const newcmt=new Comment({
        postid,
        comment,
        commented_date,
    })
    const info=await newcmt.save();
    res.send(info)

})
app.get("/api/Comment/:id",async(req,res)=>{
      const id=req.params.id;
    const x=await Comment.find({"postid":id});
    res.send(x);


})
app.patch("/api/comment/update/:id",async(req,res)=>{
    try{
           const id=req.params.id;
          const x=await Comment.findOneAndUpdate({"postid":id},req.body);
         res.send(x);

    }
    catch(e)
    {
        res.send(e);
    }
})
app.delete("/api/comment/delete/:id",async(req,res)=>{
      const id=req.params.id;
     const x=await Comment.findOneAndDelete({"postid":id});
     res.send(x);

})
app.listen(6000,()=>{
    console.log("server connected succesfully")
})