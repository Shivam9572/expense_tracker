const jwt=require("jsonwebtoken");
const StatusCodes = require('http-status-codes').StatusCodes;

require("dotenv").config();


module.exports.authorization=(req,res,next)=>{
 
   if(!req.headers.authorization){
    res.status(StatusCodes.UNAUTHORIZED).send({"failed":"unauthorization"});
    return;
   }
    jwt.verify(req.headers.authorization,process.env.JWT_SECRET_KEY,function(err,result){
        if(err){
            res.send(err);
            return;
        }
        req.userId=result.userId;
        next()
    });
    
}
