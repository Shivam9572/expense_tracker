const router=require("express").Router();
const {authorization}=require("../middleware/authorization");
const {forgetPassword,ressetPasswprd,checkLink}=require("../controller/password");

router.post("/forget",forgetPassword);
router.post("/resset/:id",ressetPasswprd);
router.get("/resset/:id",checkLink);
module.exports=router;