const express = require('express');
const register = express.Router();
const sql = require('mssql');
const database = require('../database_access/query_executer');
const db = new database();

register.post("/register",async (req, res) => {
    try{
    const { user, email, password } = req.body;

    await db.executeQuery("INSERT INTO userCredentials VALUES(@user,@email,@password)",
         { "user": { "type": sql.VarChar, "value": user },
          "email": { "type": sql.VarChar, "value": email },
           "password": { "type": sql.VarChar, "value": password } })
           .then(result=>{res.redirect(308,"/todo/login");})
           .catch((err)=>{throw err});
           
    }catch(err){
        return res.status(400).json({message:err.message});
    }
},);
module.exports=register;