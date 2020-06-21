const validateUser = require("../validators/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/user");

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
          admin: user.admin
        },
        process.env.TOKEN_SECRET
    );
    return res.json({
        success: true,
        token //token: token
    })
})

module.exports = router;