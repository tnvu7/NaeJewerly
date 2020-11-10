const Sequelize = require('sequelize');

var sequelize = new Sequelize("d3uecanueahl90", "ewbtphjmloxgjl", "11919b99feac6084af2f87917e45373f1c6a6dfc29b976141f7e59cf15c976cc", 
{
    host: "ec2-34-232-24-202.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err) => console.log("Unable to connect to DB.", err));


exports.initialize=()=>{
    return new Promise(function(resolve, reject) {
        reject();
    });
    //promise
}

exports.getAllEmployees=()=> {
    return new Promise(function(resolve, reject){
        reject();
    });
}

exports.getManagers=()=> {
    var emp = [];
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.getDepartments=()=> {
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.addEmployee=(employeeData)=>{
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.getEmployeesByStatus=(status)=>{
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.getEmployeesByDepartment=(department)=>{
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.getEmployeesByManager=(manager)=>{
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.getEmployeeByNum=(num)=>{
    return new Promise(function(resolve, reject) {
        reject();
    });
}

exports.updateEmployee=(employeeData)=> {
    return new Promise(function(resolve, reject) {
        reject();
    });
}