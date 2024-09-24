const express=require("express");
const auth=express.Router();
const jwt=require("jsonwebtoken");
const secret="secret_key";

auth.use("/auth",(req,res,next)=>{
    const headerAuth=req.headers['authorization'];
    let token;
    if(headerAuth && headerAuth.startsWith("Bearer")){
        token=headerAuth.split(" ")[1];
    }
    else{
        return res.status(500).json({message:"can't fetch token from the header"});
    }
    jwt.verify(token,secret,(err,decoded)=>{
        if(err){
           return res.status(401).send({message:"Invalid token"});
        }
        req.id=decoded.id;
        next();
    });
    
});

module.exports=auth;