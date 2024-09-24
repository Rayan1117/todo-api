const express = require('express');
const authRoute = express.Router();
const database = require('../database_access/query_executer');
const db = new database();
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const secret = "secret_key";

authRoute.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const query = "SELECT * FROM userCredentials WHERE email=@email AND password=@password";
        const [user] = await db.executeQuery(query, { "email": { "type": sql.VarChar, "value": email }, "password": { "type": sql.VarChar, "value": password } });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        req.id = user.id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err.message });
    }
}, (req, res) => {
    try {
        const id = req.id;
        const token = jwt.sign({ id }, secret);
        return res.status(200).json({ token: token });
    }
    catch (err) {
        return res.send(500).json({ message: err.message });
    }
});

module.exports = authRoute;
