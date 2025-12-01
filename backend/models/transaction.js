const { DataTypes } = require("sequelize");
const seqelize=require("../utilits/databaseConnection");

const Transaction=seqelize.define("transaction",{
    order_id:{
        type:DataTypes.STRING,
        primaryKey:true
    },
    customer_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.STRING,
        defaultValue:"pending",
        allowNull:false
    }


});
module.exports=Transaction;