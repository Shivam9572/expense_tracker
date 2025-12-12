 
 const {GeminiResponse}=require("../services/gemini_ai");
const StatusCodes = require('http-status-codes').StatusCodes;
 module.exports.geminiResponse=async(req,res)=>{
    try {
        let content=req.body.content;
      let response=await GeminiResponse(content);
      if(!response){
        throw new Error("gemini error");
      }
       res.status(StatusCodes.OK).send({response:response});
    } catch (error) {
        console.log(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error:error.message});
    }
 }