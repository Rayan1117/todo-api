const express = require('express');
const os = require('os');
const authenticated=require('./routers/authenticated');
const jwt=require('jsonwebtoken');
const app = express();
const PORT = 5000;
const auth=require("./routers/authorize");
const registration = require('./routers/registration');
const taskRoute = require('./manipulate_tasks/task_route');

app.use(express.json());

app.use("/todo",auth);
app.use("/todo",registration);
app.use("/todo",authenticated);
app.use("/todo",taskRoute);
app.get("/",(req,res)=>{
    res.send("hello it's working");
})

app.listen(PORT, () => {
    const networkInterfaces = os.networkInterfaces();
    let ipv4;
    Object.keys(networkInterfaces).forEach((key) => {
        networkInterfaces[key].forEach((networkInterface) => {
            if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
                ipv4 = networkInterface.address;
            }
        });
    });

    console.log(`Server is running on http://${ipv4}:${PORT}`);
});
