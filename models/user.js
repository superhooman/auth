const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('User', userScheme);