const Subscription=require("../models/subscription");
module.exports.isPremium = async (req, res,next) => {
    try {
        let result = await Subscription.findOne({ where: { user_id: req.userId } });
        if (!result) {
           
             res.json({"message":"unauthorizaton","success": false });
             return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.json({"message":"something went wrong","success": false });
    }
}