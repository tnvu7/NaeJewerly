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
    }
});

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err) => console.log("Unable to connect to DB.", err));

var Employee = sequelize.define("Employee", {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal:Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
});

var Department = sequelize.define("Department", {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true  
    },
    departmentName: Sequelize.STRING
}, {
    createdAt: false,
    updatedAt: false
});
exports.initialize=()=>{
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(() =>
                resolve()
            ).catch(function (err) {
                reject("Unable to sync the database");
        });
    }); 
}

exports.getAllEmployees=()=> {
    return new Promise(function(resolve, reject){
        Employee.findAll().then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject("no results returned.")
        });
    });
}

exports.getDepartments=()=> {
    return new Promise(function(resolve, reject) {
        Department.findAll().then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject("no results returned.")
        });
    });
}

exports.addEmployee=(employeeData)=>{
    return new Promise(function(resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let obj in employeeData)
        {
            if (employeeData[obj] === "")
                employeeData[obj] = null;
        }
        Employee.create(employeeData).then((data) =>{
            resolve("Sucessfully added employee"); //check
        }).catch((err) =>{
            reject("Unable to create employee");
        });
    });
}

exports.addDepartment=(departmentData) => {
    return new Promise(function(resolve, reject) {
        for (let obj in departmentData)
        {
            if (departmentData[obj] == "")
                departmentData[obj] = null;
        }
        Department.create(departmentData).then((data) =>{
            resolve("Sucessfully added department"); 
        }).catch((err) =>{
            reject("unable to create employee");
        });
    });
}

exports.updateDepartment=(departmentData)=> {
    return new Promise(function(resolve, reject) {
        for (let obj in departmentData)
        {
            if (departmentData[obj] === "")
                departmentData[obj] = null;
        }
        Department.update(departmentData, {
            where: {departmentId: departmentData.departmentId}
        }).then((data) => 
        resolve("Department Update success.")).catch((e) =>
        reject("ERROR: Unable to update department"));
    });
}


exports.getEmployeesByStatus=(status)=>{
    return new Promise(function(resolve, reject) {
        Employee.findAll().then(function(data)
        {
            var tmp = [];
            for (var i = 0; i<data.length; i++){
                if (data[i].status == status)
                    tmp.push(data[i]);
            }
            resolve(tmp);
        }).catch((err) => {
            reject("no results returned.")
        });
    });
}

exports.getEmployeesByDepartment=(department)=>{
    return new Promise(function(resolve, reject) {
        Employee.findAll().then(function(data)
        {
            var tmp = [];
            for (let i = 0; i<data.length; i++){
                if (data[i].department == department)
                    tmp.push(data[i]);
            }
            resolve(tmp);
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

exports.getEmployeesByManager=(manager)=>{
    return new Promise(function(resolve, reject) {
        Employee.findAll().then(function(data)
        {
            var tmp = [];
            for (let i = 0; i<data.length; i++){
                if (data[i].employeeManagerNum == manager)
                    tmp.push(data[i]);
            }
            resolve(tmp);
        }).catch((err) => {
            reject("no results returned.")
        });
    });
}

exports.getEmployeeByNum=(num)=>{
    return new Promise(function(resolve, reject) {
        Employee.findAll({
            where: {employeeNum: num}
        }).then((data) =>
        {
           data = data.map(value => value.dataValues);
           if (data.length > 0)
            resolve(data[0]);
            else
            reject("ERROR: Cannot find employee");
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

exports.getDepartmentById=(id)=>{
    return new Promise(function(resolve, reject) {
        Department.findAll({
                where: {departmentId: id}
            }).then((data) =>
        {
            data = data.map(value => value.dataValues);
            if (data.length > 0)
             resolve(data[0]);
             else
             reject("ERROR: Cannot find employee");
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}
exports.updateEmployee=(employeeData)=> {
    return new Promise(function(resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (let obj in employeeData)
        {
            if (employeeData[obj] == "")
                employeeData[obj] = null;
        }
        Employee.update(employeeData, {
            where: {employeeNum: employeeData.employeeNum}
        }).then((data) => resolve()).catch((e) =>
        reject("ERROR: Cannot Update."));
    }).catch(() => console.log("ERROR: no results returned."));
}

exports.deleteEmployeeByNum=(empNum)=> {
    return new Promise(function(resolve, reject) {
        Employee.destroy({
            where: {employeeNum: empNum}
        }).then((data)=>
        {
            resolve();
        }).catch((err) =>{
            reject("ERROR: Cannot delete employee");
        });
    });
}
