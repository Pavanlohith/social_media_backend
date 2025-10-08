const jwt=require('jsonwebtoken')
module.exports=function(req,res,next){
    try{
        const token=req.header('x-token');
        const decode=jwt.verify(token,'jwtsecret')
        req.user=decode.user;
        next();
    }
    catch(e){
        res.send(e);
    }
}