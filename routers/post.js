const router = require("express").Router();
const Post = require("../models/post");
const validatePost = require("../validators/post");
const verify = require("../utils/verify");

router.post("/add", verify, async (req, res) => {
    const {error} = validatePost(req.body)
    if(error){
        return res.json({
            success: false,
            error: error.details[0].message
        });
    }

    const post = new Post({
        title: req.body.title,
        body: req.body.body
    })
    const saved = await post.save();
    return res.json({
        success: true,
        post: saved
    })
})

router.get("/get", async (req, res) => {
    const posts = await Post.find({}, {
        body: false
    });
    return res.json({
        success: true,
        posts
    })
})

module.exports = router