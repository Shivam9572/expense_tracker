const express=require("express");
const router=express.Router();
const {addExpense,getExpense, deleteExpense, allExpense}=require("../controller/expense");
const {authorization}=require("../middleware/authorization");

router.post("/",authorization,addExpense);
router.get("/",authorization,getExpense);
router.delete("/:id",deleteExpense);

module.exports=router;