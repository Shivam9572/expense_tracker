const express=require("express");
const router=express.Router();
const path=require("path");

router.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","views","index.html"),(err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});
router.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","views","signup.html"),(err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});
router.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","views","login.html"),(err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});
router.get("/payment",(req,res)=>{
  res.sendFile(path.join(__dirname,"..","views","paymentPage.html"),(err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
})
module.exports=router;
