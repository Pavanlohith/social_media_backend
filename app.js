const express=require('express')
const app=express()
const connectDB=require("./db/db.js")
const jwt=require('jsonwebtoken')
const post=require("./models/post.js")
const middleware=require("./middleware.js")
const Comment = require("./models/comment.js")
const bcrypt=require('bcrypt')
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
    const hashpassword=await bcrypt.hash(password,10)
    const usersschema=new user({
        ID:uuidv4(),
        username,
        email,
        password:hashpassword,
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
    const hashpassword=await bcrypt.hash(password,10)
    const ismattch=await bcrypt.compare(password,exist.password)
    if(!ismattch){
        res.send("wrong passowrd")
    }
    const payload={
        user:{
            id:exist.ID
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
app.post("/api/posts",middleware,async(req,res)=>{
    const userid=req.user.id;
    
    const{caption,likes,created_date}=req.body;
    const newpost=new post({
        ID:uuidv4(),
        
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

    const x=await post.findOne({"ID":id});
    res.send(x);

})



app.patch("/api/posts/:pid",middleware,async(req,res)=>{
 
    const pid=req.params.pid;
    //  const exist=await user.findById(req.user.id)
     let postdata=await post.findOne({"ID":pid})
     if (postdata.userid!=req.user.id)

        {
            return res.send("you arenot allowed to update")
        }
     const x=await post.findOneAndUpdate({"ID":pid},req.body);
     res.send(x);

})
app.delete("/api/posts/delete/:pid",middleware,async(req,res)=>{
      const pid=req.params.pid;
        const postdata=await post.findOne({"ID":pid})
        if(postdata.userid!==req.user.id){

        
            return res.send("you arenot allowed to delete")
        }
     const x=await post.findOneAndDelete({"ID":pid});
     res.send(x);

})

//comment part
app.post("/api/comment",middleware,async(req,res)=>{
    const userid=req.user.id;
    const{postid,comment,commented_date}=req.body;
    const newcmt=new Comment({
        ID:uuidv4(),
        
        postid,
        comment,
        commented_date,
    })
    const info=await newcmt.save();
    res.send(info)

})
app.get("/api/Comment/:id",async(req,res)=>{
      const id=req.params.id;
    const x=await Comment.find({"ID":id});
    res.send(x);


})
app.patch("/api/comment/update/:cid",middleware,async(req,res)=>{
    try{
           const cid=req.params.cid;
          const cmntdata=await Comment.findOne({"ID":cid});
          
        if(cmntdata.userid!=req.user.id){
       res.send("you arenot allowed to update")
        }
        const x=await Comment.findOneAndUpdate({"ID":cid},req.body);
         res.send(x);

    }
    catch(e)
    {
        res.send(e);
    }
})
app.delete("/api/comment/delete/:cid",middleware,async(req,res)=>{
      const cid=req.params.cid;
        const cmntdata=await Comment.findOne({"ID":cid});
          
         if(cmntdata.userid!=req.user.id){
       res.send("you arenot allowed to delete")
        }
     const x=await Comment.findOneAndDelete({"ID":cid});
     res.send(x);

})
app.listen(8000,()=>{
    console.log("server connected succesfully")
})