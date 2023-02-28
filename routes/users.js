const router = require("express").Router();

router.get("/",(req,res)=>{
    res.send("welcome to User page");
})
module.exports = router;