var employees = [];
var departments = [];

const fs = require('fs');
exports.initialize=()=>{
    return new Promise(function(resolve, reject) {
        fs.readFile('./data/employees.json', (err,data) => {
            if (err)
            {
                reject("Error: Cannot read employees.json");
            }
            else{
                employees = JSON.parse(data);
                
                fs.readFile('./data/departments.json', (err,data) => {
                    
                    if (err)
                    {
                        reject("Error: Cannot read departments.json");
                    }
                    else
                    {
                        departments = JSON.parse(data);
                        resolve("File read successfully");
                    }
                });
            }
           
        });
    });
    //promise
}

exports.getAllEmployees=()=> {
    
    return new Promise(function(resolve, reject){
        if (employees.length == 0)
        {
            reject("no results returned");
        }
        else{
            resolve(employees);
        }
    });
}

exports.getManagers=()=> {
    var emp = [];
    return new Promise(function(resolve, reject) {
        if (employees.length == 0)
        {
            reject("no results returned");
        }
        else{
            for (var i = 0; i<employees.length; i++)
            {
                if (employees[i].isManager == true)
                {
                    emp.push(employees[i]);
                }
            }
            resolve(emp);
        }
    });
}

exports.getDepartments=()=> {
    return new Promise(function(resolve, reject) {
        if (departments.length == 0)
        {
            reject("no results returned");
        }
        else{
            resolve(departments);
        }
    });
}

exports.addEmployee=(employeeData)=>{
    return new Promise(function(resolve, reject) {
        if (employeeData.isManager == undefined)
        {
            employeeData.isManager = false;
        }
        else {
            employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve(employees);
    });
}

exports.getEmployeesByStatus=(status)=>{
    return new Promise(function(resolve, reject) {
        var emp = [];
        
            for (var i =0; i<employees.length; i++)
            {
                if (employees[i].status == status)
                {
                    emp.push(employees[i]);
                }
            }
            
            if (emp.length == 0)
            {
                reject("no results returned");
            }
            else
            resolve(emp);
    });
}

exports.getEmployeesByDepartment=(department)=>{
    return new Promise(function(resolve, reject) {
        var emp = [];
            for (var i =0; i<employees.length; i++)
            {
                if (employees[i].department == department)
                {
                    emp.push(employees[i]);
                }
            }
        if (emp.length == 0)
        {
            reject("no results returned");
        }
        else
        resolve(emp);
        
    });
}

exports.getEmployeesByManager=(manager)=>{
    return new Promise(function(resolve, reject) {
        var emp = [];
            for (var i =0; i<employees.length; i++)
            {
                if (employees[i].employeeManagerNum == manager)
                {
                    emp.push(employees[i]);
                }
            }
        if (emp.length == 0)
        {
            reject("no results returned");
        }
        else
            resolve(emp);
        
    });
}

exports.getEmployeeByNum=(num)=>{
    return new Promise(function(resolve, reject) {
        var emp = {};
            for (var i =0; i<employees.length; i++)
            {
                if (employees[i].employeeNum == num)
                {
                    emp = employees[i];
                    i = employees.length;
                }
            }
        if (emp.length == 0)
        {
            reject("no results returned");
        }
        else
            resolve(emp);
        
    });
}

exports.updateEmployee=(employeeData)=> {
    return new Promise(function(resolve, reject) {
   for (var i = 0; i< employees.length; i++)
        {
            if (employees[i].employeeNum == employeeData.employeeNum)
            {
                Object.assign(employees[i], employeeData);
                resolve();
            }
        }
    });
}