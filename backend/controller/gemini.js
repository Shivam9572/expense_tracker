 
 const {GeminiResponse}=require("../services/gemini_ai");

 module.exports.geminiResponse=async(req,res)=>{
    try {
        let content=req.body.content;
      let response=await GeminiResponse(content);
      if(!response){
        throw new Error("gemini error");
      }
       res.send({response:response});
    } catch (error) {
        console.log(error.message);
        res.send({error:error.message});
    }
 }