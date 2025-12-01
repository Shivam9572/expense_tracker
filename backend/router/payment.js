const router=require("express").Router();
const {authorization}=require("../middleware/authorization");
const {order,orderStatus}=require("../controller/payment")

router.post("/order",authorization,order);
router.get("/payment-status",orderStatus);
module.exports=router;