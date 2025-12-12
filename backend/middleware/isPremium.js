const Subscription=require("../models/subscription");
const StatusCodes = require('http-status-codes').StatusCodes;

module.exports.isPremium = async (req, res,next) => {
    try {
        let result = await Subscription.findOne({ where: { user_id: req.userId } });
        if (!result) {
           
             res.status(StatusCodes.UNAUTHORIZED).json({"message":"unauthorizaton","success": false });
             return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({"message":"something went wrong","success": false });
    }
}