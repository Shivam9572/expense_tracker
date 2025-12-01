const { DataTypes } = require("sequelize");
const seqelize=require("../utilits/databaseConnection");
const subcription=seqelize.define("subcription",{
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    
});
module.exports=subcription;