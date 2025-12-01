const express=require("express");
const router=express.Router();
const {authorization}=require("../middleware/authorization");
const middleware=require("../middleware/isPremium");


const {signup,login,isPremium,downloaded, generateReport}=require("../controller/user");
router.post("/signup",signup);
router.post("/login",login);
router.get("/isPremium",authorization,isPremium);
router.get("/download",authorization,middleware.isPremium,downloaded);
router.get("/gernateReport",authorization,middleware.isPremium,generateReport);

module.exports=router;