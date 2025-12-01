const { DataTypes } = require("sequelize");
const seqelize=require("../utilits/databaseConnection");

let Report=seqelize.define("report",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    },
    year:{
        type:DataTypes.INTEGER,
    },
    month:{
        type:DataTypes.STRING
    }
});
module.exports=Report;