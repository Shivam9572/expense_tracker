const router=require("express").Router();
const {allExpense}=require("../controller/premium");

router.get("/allExpense",allExpense);
module.exports=router;