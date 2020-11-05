/*********************************************************************************
* BTI325 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Thu Nga (Natalie) Vu    Student ID: 132 165 192     Date: 2020/11/05
*
* Online (Heroku) URL: (make sure you include the link ending with .com, NOT .git
* https://mysterious-savannah-61047.herokuapp.com/

*******************************************************************/

var message = require('./data-service.js');

var express = require("express");
var app = express();

var path = require("path");

const multer = require('multer');
const bodyParser = require("body-parser");

var exphbs = require("express-handlebars");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(bodyParser.urlencoded({extended: true}));

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
}}));
app.set("view engine", ".hbs");

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
      
app.use(express.static("./public/"));
app.get("/", function(req, res){
    res.render("home");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/employees/add", function(req, res){
    res.render("addEmployee");
});

app.get("/images/add", function(req, res){
    res.render("addImage");
});

app.get("/employees", function(req, res){
    const params = new URLSearchParams(req.query);
    if (params.has('status')) 
    {
        message.getEmployeesByStatus(req.query.status).then((data)=>{
            res.render("employees", {employees: data});
        }).catch((err)=> {
            res.render({message: "no results"});
        });
    }
    else if (params.has('department'))
    {
        message.getEmployeesByDepartment(req.query.department).then((data)=>{
            res.render("employees", {employees: data});
        }).catch((err)=> {
            res.render({message: "no results"});
        });
    }
    else if (params.has('manager'))
    {
        message.getEmployeesByManager(req.query.manager).then((data)=>{
            res.render("employees", {employees: data});
        }).catch((err)=> {
            res.render({message: "no results"});
        });
    }
    else{
        message.getAllEmployees().then((data)=>
        {
            res.render("employees", {employees: data});
        }).catch((err)=> {
            res.render({message: "no results"});
        });
    }

});
app.get("/employee/:num", function(req, res) {
    message.getEmployeeByNum(req.params.num).then((data)=>{
        res.render("employee", { employee: data });
    }).catch((err)=> {
        res.render("employee",{message:"no results"});
    });
});

app.get("/departments", function(req, res){
    message.getDepartments().then((data)=>{
        res.render("departments", {departments: data});
    }).catch((err)=> {
        res.send({message: err});
    });
});

const fs = require('fs');
app.get("/images", function(req, res){
    fs.readdir('./public/images/uploaded', function(err, items) {
        res.render("images", {items});
    });
});

app.get('*', function(req, res){
    res.status(404);
    res.sendFile(path.join(__dirname, "/views/errorpage.html"));
    
});

app.post("/images/add", upload.single("imageFile"), (req, res) =>
{
    res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
    const formData = req.body;
    message.addEmployee(formData).then((data)=>{
        res.redirect("/employees");
    }).catch((err)=> {
        res.send({message: err});
    });
});

app.post("/employee/update", (req, res) => { 
    message.updateEmployee(req.body).then(()=> {
        res.redirect("/employees"); 
    });
});

message.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=> {
    console.log("Error: " + err);
});