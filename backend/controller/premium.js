
 const User=require("../models/users");
module.exports.allExpense = async (req, res) => {
    try {
        let result = await User.findAll({attributes:["name","total_amount"],order:[["total_amount","DESC"]]});
        
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send({error:error.message});
    }
}