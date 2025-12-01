const router=require("express").Router();
const path=require("path");

router.get("/forget",(req,res)=>{
     res.sendFile(path.join(__dirname,"..","views","forgetPassword.html"),(err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Internal Server Error');
        }
      });
});
router.get("/resset",(req,res)=>{
     res.sendFile(path.join(__dirname,"..","views","resset.html"),(err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Internal Server Error');
        }
      });
});
module.exports=router;