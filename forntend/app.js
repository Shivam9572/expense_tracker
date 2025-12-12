
  require("dotenv").config();
const express=require("express");
const app=express();
const compression=require("compression");
const morgan=require("morgan");
const fs=require("fs");

const userRouter=require("./router/user");
const forgetPassword=require("./router/forgetPassword");


const path = require("path");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
app.set(path.join(__dirname,"views"));
app.use(express.static("public"));


app.use("/password",forgetPassword);
app.use("/",userRouter);


app.listen(process.env.PORT,"0.0.0.0",()=>{
    console.log("3000 is running");
})
