require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRouter = require("./routers/post");
const authRouter = require("./routers/auth");

const app = express();

mongoose.connect(process.env.DB_CONNECT);

app.use(bodyParser.json());

app.use("/post", postRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("ok")
});


app.listen(process.env.PORT, () => {
    console.log("Server started")
});