/*********************************************************************************
* BTI325 – Assignment 6
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Thu Nga (Natalie) Vu    Student ID: 132 165 192     Date: 2020/12/06
*
* Online (Heroku) URL: (make sure you include the link ending with .com, NOT .git
* https://mysterious-savannah-61047.herokuapp.com/

*******************************************************************/

var express = require("express");
var app = express();

var path = require("path");

const multer = require('multer');
const bodyParser = require("body-parser");

var exphbs = require("express-handlebars");

const clientSessions = require("client-sessions");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(bodyParser.urlencoded({extended: true}));
app.use(clientSessions({
    cookieName: "session", 
    secret: "SecretMessageForAssignment4", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
  }));

  app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
    });

app.engine(".hbs", exphbs({
    extname:".hbs",
    defaultLayout: "main",
    helpers: {
    navLink: function(url, options){
        return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
},
runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
}
}));
app.set("view engine", ".hbs");

//middleware
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
        }
       
});

const upload = multer({ storage: storage });

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });

app.use(express.static(__dirname + '/public'));  

app.use(express.static("./public/"));
app.get("/", function(req, res){
    res.render("home");
});

app.get("/shop", function(req, res){
    res.render("shop");
});



app.get("/departments/add", ensureLogin,function(req, res){
    res.render("addDepartment");
});

app.get("/images/add", ensureLogin, function(req, res){
    res.render("addImage");
});


const fs = require('fs');
app.get("/images", ensureLogin, function(req, res){
    fs.readdir('./public/images/uploaded', function(err, items) {
        res.render("images", {items});
    });
});



app.post("/images/add", ensureLogin, upload.single("imageFile"), (req, res) =>
{
    res.redirect("/images");
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res)=> {
    res.render("register");
});


app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
  });
app.get("/userHistory", ensureLogin, (req, res)=> {
    res.render("userHistory");
});

app.get('*', function(req, res){
    res.status(404);
    res.sendFile(path.join(__dirname, "/views/errorpage.html"));
    
});
    app.listen(HTTP_PORT, onHttpStart);

