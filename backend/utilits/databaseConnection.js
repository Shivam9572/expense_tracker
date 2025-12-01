require("dotenv").config();
const {Sequelize}=require("sequelize");
const mysql=require("mysql2");


// let conneection=mysql.createConnection({
//   host:process.env.D_HOST,
//   user:process.env.D_USER,
//   password:process.env.D_PASSWORD
// });
// function createDatabase(){conneection.query("CREATE DATABASE IF NOT EXISTS expensive_tracker",(err,result)=>{
//   if(err){
//     console.log("error in mannual create database",err);
//     return;
//   }
  
// });}
// createDatabase();
const sequelize = new Sequelize('expensive_tracker', process.env.D_USER, process.env.D_PASSWORD, {
  host: process.env.D_HOST,
  dialect: 'mysql',
  timezone: '+05:30',
  logging:false
});

(async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})();
module.exports=sequelize;
