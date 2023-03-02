const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// router.get("/",(req,res)=>{
//     console.log("post");
// })

// Create a post

router.post("/",async (req,res)=>{
    const newPost = new Post(req.body);

    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(error){
        res.status(500).json(error);
    }

});

// Update a post

router.put("/:id", async (req,res)=>{
    try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await Post.updateOne({$set:req.body});
        res.status(200).json("Post has been updated");
    }else{
        res.status(403).json("you can update only your post")
    }
    }catch(error){
        res.status(500).json(error);
    }
});

// Delete a post

router.delete("/:id", async (req,res)=>{
    try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await Post.deleteOne();
        res.status(200).json("Post has been deleted");
    }else{
        res.status(403).json("you can delete only your post")
    }
    }catch(error){
        res.status(500).json(error);
    }
});

// Like or dislike a post

router.put("/:id/like",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("post has been liked");
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("post has been disliked");

        }
    }catch(error){
        res.status(500).json(error);
    }

});

// Get a post

router.get("/:id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(error){
        res.status(500).json(error);
    }
});

// Get all timeline posts

router.get("/timeline/all",async (req,res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendsPosts = await Promise.all(
            currentUser.following.map(friendId =>{
              return Post.find({userId: friendId});
            })
        );
        res.json(userPosts.concat(...friendsPosts))
    }catch(error){
        res.status(500).json(error);
    }
});


module.exports = router;
