const router=require("express").Router();
const {data}=require("../data/report");

router.get("/",(req,res)=>{
    res.send(data);
});
module.exports=router;