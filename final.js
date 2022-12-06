var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "email": {
        unique: true,
        type: String
    },
    "password": String
});


let connection;
var finalUsers;
module.exports.startDB = function() {
    return new Promise((res, rej) => {
        connection = mongoose.createConnection("mongodb+srv://ceejbnvntra:cj950609@a6.gq5g3f7.mongodb.net/finalAccounts");
        connection.on("error", (err) => {
            console.log("Cannot connect to DB.");
            rej(err);
        });

        connection.once("open", () => {
            console.log("DB connection successful");
            finalUsers = connection.model("finalusers", userSchema);
            res();
        });
    });
}

module.exports.register = function(user) {
    return new Promise((res, rej) => {
        if(user.password.trim().length === 0 || user.email.trim() === 0) {
            rej("Error: email or password cannot be empty");
        }
        else {
            bcrypt.hash(user.password, 10).then(hash => {
                user.password = hash;
                let newUser = new finalUsers(user);
                newUser.save().then(() => {
                    res(newUser);
                }).catch((err) => {
                    if(err.code == 11000) {
                        rej("Error: " + user.email + " already exists");
                    }
                    else {
                        rej("Error: cannot create the user");
                    }
                })
            });
        }
    });
}

module.exports.signIn = (user) => {
    return new Promise((res, rej) => {
        finalUsers.findOne({email: user.email}).exec().then((foundUser) => {
            if(foundUser) {
                bcrypt.compare(user.password, foundUser.password).then((result) => {
                    if(result) {
                        res(foundUser);
                    }
                    else {
                        rej("Incorrect password for user " + user.email);
                    }
                });
            }
            else {
                rej("Cannot find the user: " + user.email);
            }
        }).catch(() => {
            rej("Cannot find the user: " + user.email);
        });
    });
}