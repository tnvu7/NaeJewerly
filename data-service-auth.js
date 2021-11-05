var mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const e = require("express");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        dateTime: Date,
        userAgent: String
    }]
});

let User; 

exports.addtocart=()=>{
    
}

exports.initialize=()=>{
    return new Promise(function(resolve, reject) {
        //connect to module
        mongoose.set('useCreateIndex', true);
        var uri2 = "mongodb+srv://vuthu:0000@senecaweb.gj8ce.mongodb.net/<dbname>?retryWrites=true&w=majority";
        let db1 = mongoose.createConnection(uri2, {
            useNewUrlParser: true, useUnifiedTopology: true
        },
        function (err) {
            if (err) 
            {
                reject(err);
            }
            else 
            {
                //register
                User = db1.model("users", userSchema);
                resolve();
            }
        });
    });
}

exports.registerUser=(userData)=>{
    return new Promise(function(resolve, reject) {
        if (userData.userName.trim() === "" || userData.password.trim() === "" || userData.password2.trim() === "") //check later
            reject("Error: username or password cannot be empty or only white spaces!");
        else if (userData.password !== userData.password2)
            reject("Error: Passwords do not match");
        else
        {
            bcrypt.genSalt(10, function(err, salt) { 
                if (err) reject("There was an error encrypting the password");
                else {
                    bcrypt.hash(userData.password, salt, function(err, hashValue) { 
                        if (err) 
                            reject("There was an error encrypting the password");
                        else 
                        {
                            let newUser = new User(userData);
                            newUser.password = hashValue;
                            newUser.save((err)=> {
                                if (err) 
                                {
                                    if (err.code == 11000)
                                    reject("User Name already taken");
                                    else
                                    reject(`There was an error creating the user: ${err}`);
                                }
                                else
                                    resolve();
                            });
                        } 
                    }); //hash
                } //else
            });
        }
});
}
exports.checkUser=(userData)=>{
    return new Promise(function(resolve, reject) {
        User.findOne({ userName: userData.userName })
        .exec().then((foundUser)=> {
            bcrypt.compare(userData.password, foundUser.password).then((res)=>{
                if (res === true)
                {
                    foundUser.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                    User.updateOne(
                        {userName: foundUser.userName},
                        {$set:{loginHistory: foundUser.loginHistory}}
                    ).exec().then(()=>{
                        resolve(foundUser);
                    }).catch((err)=>
                    {
                        reject("There was an error verifying the user: " + err);
                    });
                }
                else
                {
                    reject("Unable to find user:" + userData.userName)
                }
            });
        }).catch((err)=> {
            console.log(err);
            reject("Unable to find user:" + userData.userName);
        });
    });
}

