const express=require("express");
const router=express.Router();
const path=require("path");

router.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","public","views","index.html"),(err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});



module.exports=router;
