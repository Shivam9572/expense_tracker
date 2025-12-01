const { DataTypes } = require("sequelize");
const seqelize=require("../utilits/databaseConnection");

let Users=seqelize.define("user",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    total_amount:{
        type:DataTypes.INTEGER,
        defaultValue:0
    }
});
module.exports=Users;