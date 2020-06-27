const validateUser = require("../validators/user");
const validateChange = require("../validators/changePassword");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/user");
const verify = require("../utils/verify");

router.post("/register", async (req, res) => {
    const {error} = validateUser(req.body);

    if(error){
        return res.json({
            success: false,
            error: error.details[0].message
        })
    }

    const exists = await User.findOne({
        login: req.body.login
    })

    if(exists){
        return res.json({
            success: false,
            error: "user exists"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        login: req.body.login,
        password: hashedPassword
    })

    try{
        const saved = await user.save();
        return res.json({
            success: true,
            user: saved
        })
    }catch(err){
        console.log(err)
        return res.json({
            success: false,
            error: "DB error"
        })
    }
})

router.post("/login", async (req, res) => {
    const {error} = validateUser(req.body);

    if(error){
        return res.json({
            success: false,
            error: error.details[0].message
        })
    }

    const user = await User.findOne({
        login: req.body.login
    })

    if(!user){
        return res.json({
            success: false,
            error: "No user"
        })
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) {
        return res.json({
            success: false,
            error: "Wrong password"
        });
    }

    const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.TOKEN_SECRET
    );
    return res.json({
        success: true,
        token //token: token
    })
})

router.post("/bio", verify, async (req, res) => {
    if(!req.body.bio){
        return res.json({
            success: false,
            error: "No bio"
        })
    }
    const user = await User.findByIdAndUpdate(req.user, {
        bio: req.body.bio
    }, {
        new: true
    })

    return res.json({
        success: true,
        user
    })
})

router.post("/changePassword", async (req, res) => {
    const {error} = validateChange(req.body);

    if(error){
        return res.json({
            success: false,
            error: error.details[0].message
        })
    }

    const user = await User.findOne({
        login: req.body.login
    })

    if(!user){
        return res.json({
            success: false,
            error: "No user"
        })
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) {
        return res.json({
            success: false,
            error: "Wrong password"
        });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    const newUser = await User.findByIdAndUpdate(user._id, {
        password: hashedPassword
    }, {
        new: true
    })

    return res.json({
        success: true
    })
})

router.get("/user/:id", async  (req, res) => {
    if(!req.params.id){
        return res.json({
            success: false,
            error: "No id"
        })
    }
    const user = await User.findById(req.params.id, {
        password: false
    });
    return res.json({
        success: true,
        user
    })
})

module.exports = router;