/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Thu Nga (Natalie) Vu    Student ID: 132 165 192     Date: 2020/11/20
*
* Online (Heroku) URL: (make sure you include the link ending with .com, NOT .git
* https://mysterious-savannah-61047.herokuapp.com/

*******************************************************************/

var dataServiceAuth = require("./data-service-auth.js");
var message = require('./data-service.js');

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
      
app.use(express.static("./public/"));
app.get("/", function(req, res){
    res.render("home");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/employees/add", ensureLogin, function(req, res){
    message.getDepartments().then((data)=> {
        res.render("addEmployee", {departments: data});
    }).catch((err)=>{
        res.render("addEmployee", {departments: []});
    });
});

app.get("/departments/add", ensureLogin,function(req, res){
    res.render("addDepartment");
});

app.get("/images/add", ensureLogin, function(req, res){
    res.render("addImage");
});

app.get("/employees", ensureLogin, function(req, res){
    const params = new URLSearchParams(req.query);
    if (params.has('status')) 
    {
        message.getEmployeesByStatus(req.query.status).then((data)=>{
            res.render("employees", {employees: data});
        }).catch((err)=> {
            res.render("employees", {message: "no results"});
        });
    }
    else if (params.has('department'))
    {
        message.getEmployeesByDepartment(req.query.department).then((data)=>{
            res.render("employees", {employees: data});
        }).catch((err)=> {
            res.render("employees", {message: "no results"});
        });
    }
    else if (params.has('manager'))
    {
        message.getEmployeesByManager(req.query.manager).then((data)=>{
             res.render("employees", {employees: data});
        }).catch((err)=> {
            res.render("employees", {message: "no results"});
        });
    }
    else{
        message.getAllEmployees().then((data)=>
        {
        if (data.length > 0) {
            res.render("employees", {employees: data});
        }else{
            res.render("employees",{ message: "No results." });
        }
        }).catch((err)=> {
            res.render("employees", {message: err});
        });
    }

});
app.get("/departments", ensureLogin, function(req, res){
    message.getDepartments().then((data)=>{
        if (data.length > 0) {
            res.render("departments", {departments: data});
        }
        else{
            
            res.render("departments",{ message: "No results." });
        }
    }).catch((err)=> {
        res.render("departments",{ message: err });
    });
});

app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    message.deleteEmployeeByNum(req.params.empNum).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    message.getEmployeeByNum(req.params.empNum).then((data) => {
    if (data) {
    viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
    viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => {
    viewData.employee = null; // set employee to null if there was an error
    }).then(message.getDepartments)
    .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
    if (viewData.departments[i].departmentId == viewData.employee.department) {
    viewData.departments[i].selected = true;
    }
    }
    }).catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
    res.status(404).send("Employee Not Found");
    } else {
    res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    });
    });

app.get("/department/:departmentId", ensureLogin, function(req, res) {
    message.getDepartmentById(req.params.departmentId).then((data)=>{
        if (data) 
        {
            //console.log(data);
            res.render("department", { department: data });
        }
        else
            res.status(404).send("Department Not Found");
    }).catch((err)=> {
        res.status(404).send("Department Not Found");
    });
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

app.post("/employees/add", ensureLogin, (req, res) => {
    const formData = req.body;
    message.addEmployee(formData).then((data)=>{
        res.redirect("/employees");
    }).catch((err)=> {
        res.send({message: err});
    });
});

app.post("/departments/add", ensureLogin, (req, res) => {
    const formData = req.body;
    message.addDepartment(formData).then((data)=>{
        res.redirect("/departments");
    }).catch((err)=> {
        res.send({message: err});
    });
});

app.post("/employee/update", ensureLogin, (req, res) => { 
    message.updateEmployee(req.body).then(()=> {
        res.redirect("/employees"); 
    }).catch((err)=>{
        res.status(500).send("Unable to Update Employee");
        });
});

app.post("/department/update", ensureLogin, (req, res) => { 
    message.updateDepartment(req.body).then(()=> {
        res.redirect("/departments"); 
    }).catch((err)=>{
        res.status(500).send("Unable to Update Department");
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res)=> {
    res.render("register");
});
app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body).then(()=>{
        res.render("register", {successMessage: "User created"})
    }).catch((err)=> {
        res.render("register", {errorMessage: err, userName: req.body.userName});
    });
});
app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body).then((user) => {
        req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
        }
        res.redirect('/employees');
    }).catch((err)=>
    {
        res.render("login", {errorMessage: err, userName: req.body.userName})
    })
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
message.initialize()
.then(dataServiceAuth.initialize)
.then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=> {
    console.log("Unable to start server: " + err);
});