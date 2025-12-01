const router=require("express").Router();

const {geminiResponse}=require("../controller/gemini");
router.post("/",geminiResponse);
module.exports=router;