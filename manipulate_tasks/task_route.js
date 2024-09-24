const express = require('express');
const database = require('../database_access/query_executer');
const db = new database();
const sql = require('mssql');
const taskRoute = express.Router();

taskRoute.get("/auth/gettasks", async (req, res) => {
    try {
        const id = req.id;

        const result = await db.executeQuery("SELECT * FROM tasks WHERE id=@id", { "id": { "type": sql.Int, "value": id } });
        console.log("success");
        return res.status(200).json({ tasks: result });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

taskRoute.post("/auth/addtask", async (req, res) => {
    try {
        const id = req.id;
        const { title, description } = req.body;
        const response = await db.executeQuery("INSERT INTO tasks VALUES(@id,@title,@description,default);SELECT SCOPE_IDENTITY() AS LastID;", {
            "id": { "type": sql.Int, "value": id },
            "title": { "type": sql.VarChar, "value": title },
            "description": { "type": sql.VarChar, "value": description }
        });
        const taskid = response[0].LastID;
        return res.status(200).json({ message: "Task added successfully", "taskid": taskid });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

taskRoute.put("/auth/updatetask", async (req, res) => {
    const id = req.id;
    const taskID = req.query.id;
    const { title, description } = req.body;
    await db.executeQuery("UPDATE tasks SET task_title=@title, task_description=@description WHERE id=@id AND task_id=@taskID ", {
        "title": { "type": sql.VarChar, "value": title },
        "description": { "type": sql.VarChar, "value": description },
        "id": { "type": sql.Int, "value": id },
        "taskID": { "type": sql.Int, "value": taskID }
    })
        .then(result => { return res.status(200).json({ message: "task updated successfully" }); })
        .catch(err => { console.log(err.message); return res.status(500).json({ message: err.message }); });
});

taskRoute.delete("/auth/deletetask", async (req, res) => {
    const id = req.id;
    const taskID = req.query.id;
    const flag = req.query.flag
    await db.executeQuery("DELETE FROM tasks WHERE id=@id AND task_id=@taskID AND completed=@flag", {
        "id": { "type": sql.Int, "value": id },
        "taskID": { "type": sql.Int, "value": taskID },
        "flag": { "type": sql.Int, "value": flag }
    })
        .then(result => { res.status(200).json({ message: "task deleted successfully" }); })
        .catch(err => { res.status(500).json({ message: err.message }); });
    return null;
});

taskRoute.put("/auth/taskflag", async (req, res) => {
    const id = req.id;
    const taskID = req.query.id;
    const flag = req.query.flag;

    await db.executeQuery("UPDATE tasks SET completed=@flag WHERE id=@id AND task_id=@taskID",
        {
            "flag": { "type": sql.Int, "value": flag },
            "id": { "type": sql.Int, "value": id },
            "taskID": { "type": sql.Int, "value": taskID }
        })
        .then(result => { return res.status(200).json({ message: `task flagged as ${flag} successfully` }) },)
        .catch(err => { return res.status(500).json({ message: err.message }) });
});

module.exports = taskRoute;
