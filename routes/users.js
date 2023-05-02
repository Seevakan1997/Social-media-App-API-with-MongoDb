const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { findById } = require("../models/User");

// router.get("/",(req,res)=>{
//     res.send("welcome to User page");
// })

//Update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        // console.log(req.body.password);
        if(req.body.password){

            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(error){
                return res.status(500).json(error);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set: req.body});
            res.status(200).json("Account Updated");
        }catch(error){
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can update only your Account");
    }
});


//Delete user

router.delete("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account Deleted");
        }catch(error){
            return res.status(500).json(error);
        }
    }else{
        return res.status(403).json("You can delete only your Account");
    }
});



//Get a user

router.get("/",async(req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;

    try{
        const user = userId ? await User.findById(userId) : await User.findOne({username:username});

        // stop get password and updatedAt but get other details
        const {password,updatedAt,...other} = user._doc;
        res.status(200).json(other);
    }catch(error){
        res.status(500).json(error);
    }
});

//Follow a user

router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});

                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("You Already follow this user");
            }

        }catch(error){
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You cant follow yourself !")
    }
});

//Unfollow a user

router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});

                res.status(200).json("user has been Unfollowed");
            }else{
                res.status(403).json("You don't follow this user");
            }

        }catch(error){
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You cant Unfollow yourself !")
    }
});

module.exports = router;