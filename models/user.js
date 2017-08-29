var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config/database');

var userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true } 
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username}
    User.findOne(query, callback);
}
//function to add user and to hash the password 
module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err)
                throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash,callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err)
            throw err;
        callback(null, isMatch);
    });

}