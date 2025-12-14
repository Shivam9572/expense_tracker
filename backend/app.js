require("dotenv").config();
const express=require("express");
const helmet=require("helmet");
const compression=require("compression");
const app=express();
const morgan=require("morgan");
const fs=require("fs");
const path = require("path");
const cors=require("cors");
const db=require("./utilits/databaseConnection");
const userRouter=require("./router/user");
const expenseRouter=require("./router/expense");
const paymentRouter=require("./router/payment");
const premiumRouter=require("./router/premium");
const geminiRouter=require("./router/gemini");
const passwordRouter=require("./router/password");

require("./models/association");

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(helmet());

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use("api/user",userRouter);
app.use("api/expense",expenseRouter);
app.use("api/payment",paymentRouter);
app.use("api/premium",premiumRouter);
app.use("api/gemini",geminiRouter);
app.use("api/password",passwordRouter);

app.get("/",(req,res)=>{
    res.status(200).send("home");
})
db.sync({force:false}).then(()=>{
    app.listen(process.env.PORT,"0.0.0.0",()=>{
    console.log("4000is listean");
   
});
}).catch((err)=>{
    console.log(err.message);
})
