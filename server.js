var express = require('express');
var path = require('path');
var app = express();
var final = require("./final.js")
var HTTP_PORT = process.env.port || 8080;

app.use(express.urlencoded({ extended: true }));

function onHttpStart() {
    console.log ("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/finalViews/home.html'));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, '/finalViews/register.html'));
});

app.post("/register", (req, res) => {
    final.register(req.body).then((data) => {
        res.send(data.email + " registered sucessfully<br>" +
        "<a href='/'>Go Home</a>");
    }).catch((err) => {
        res.send(err);
    });
});

app.get("/signIn", (req, res) => {
    res.sendFile(path.join(__dirname, '/finalViews/signIn.html'));
});

app.post("/signIn", (req, res) => {
    final.signIn(req.body).then((data) => {
        res.send(data.email + " signed in successfully<br>" +
        "<a href='/'>Go Home</a>");
    }).catch((err) => {
        res.send(err);
    });
});

app.get("*", (req, res) => {
    res.status(404).send("Not Found");
});

final.startDB().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
})