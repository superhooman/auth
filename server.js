var express = require("express");

var app = express();

console.log(app);

function root(req, res){
    var name = req.query.name.replace(/<[^>]*>?/gm, '');;
    if(!name){
        return res.send("Error")
    }
    if(name === "gaben"){
        return res.send("Where is hl3?")
    }
    res.send(`Hello, ${name}`)
}

app.get("/", root)

app.listen(3001, function(req, res){
    console.log("started")
})