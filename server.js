/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Thu Nga (Natalie) Vu    Student ID: 132 165 192     Date: 2020/11/01
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
    defaultLayout: "main"
}));
app.set("view engine", ".hbs");

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
        }
       
});

const upload = multer({ storage: storage });

app.use(express.static("./public/"));
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"))
});

app.get("/images/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addImage.html"))
});

app.get("/employees", function(req, res){
    const params = new URLSearchParams(req.query);
    if (params.has('status')) 
    {
        message.getEmployeesByStatus(req.query.status).then((data)=>{
            res.json(data);
        }).catch((err)=> {
            res.send({message: err});
        });
    }
    else if (params.has('department'))
    {
        message.getEmployeesByDepartment(req.query.department).then((data)=>{
            res.json(data);
        }).catch((err)=> {
            res.send({message: err});
        });
    }
    else if (params.has('manager'))
    {
        message.getEmployeesByManager(req.query.manager).then((data)=>{
            res.json(data);
        }).catch((err)=> {
            res.send({message: err});
        });
    }
    else{
        message.getAllEmployees().then((data)=>
        {
            res.json(data);
        }).catch((err)=> {
            res.send({message: err});
        });
    }

});
app.get("/employee/:num", function(req, res) {
    message.getEmployeeByNum(req.params.num).then((data)=>{
        res.json(data);
    }).catch((err)=> {
        res.send({message: err});
    });
});
app.get("/managers", function(req, res){
    message.getManagers().then((data)=> {
        res.json(data);
    }).catch((err)=>{
        res.send({message: err});
    });
});

app.get("/departments", function(req, res){
    message.getDepartments().then((data)=>{
        res.json(data);
    }).catch((err)=> {
        res.send({message: err});
    });
});

const fs = require('fs');
app.get("/images", function(req, res){
    fs.readdir('./public/images/uploaded', function(err, items) {
        res.json(items);
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

message.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=> {
    console.log("Error: " + err);
});