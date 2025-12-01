const { DataTypes } = require("sequelize");
const seqelize=require("../utilits/databaseConnection");

let RessetLink=seqelize.define("links",{
    id:{type:DataTypes.STRING,
        primaryKey:true,

    }


});
module.exports=RessetLink;