
 const User=require("../models/users");
 const StatusCodes = require('http-status-codes').StatusCodes;
module.exports.allExpense = async (req, res) => {
    try {
        let result = await User.findAll({attributes:["name","total_amount"],order:[["total_amount","DESC"]]});
        
        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error:error.message});
    }
}