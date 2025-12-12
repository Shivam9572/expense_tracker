require("dotenv").config();
const {Sequelize}=require("sequelize");
const mysql=require("mysql2");



const sequelize = new Sequelize('expense_tracker', process.env.D_USER, process.env.D_PASSWORD, {
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
