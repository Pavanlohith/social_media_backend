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