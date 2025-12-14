const router=require("express").Router();


const {getIndexPage,signupPage,loginPage,forgetPasswordPage,resetPasswordPage,paymentPage}=require("../controller/views");

router.get("/",getIndexPage);
router.get("/login",loginPage);
router.get("/signup",signupPage);
router.get("/forgetPassword",forgetPasswordPage);
router.get("/resetPassword",resetPasswordPage);
router.get("/payment",paymentPage);

module.exports=router;