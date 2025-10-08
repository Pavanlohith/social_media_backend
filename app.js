const express=require('express')
const app=express()
const connectDB=require("./db/db.js")
const jwt=require('jsonwebtoken')
const middleware=require("./middleware.js")
const { v4: uuidv4 } = require('uuid');
const user=require("./models/user.js")
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

app.listen(6000,()=>{
    console.log("server connected succesfully")
})