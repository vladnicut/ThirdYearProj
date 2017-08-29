var express = require('express');
var cookieParser = require('cookie-parser');
var fs = require('fs');

var router = express.Router();

var config = require('../config/database');
var User = require('../models/user');

router.use(cookieParser());

// register
router.post('/register', function (req, res, next) {
    if (req.cookies['user_id'] == null) {
        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        User.addUser(newUser, function (err, user) {
            if (err) {
                res.render('panel', { type: "danger", msg: "Error. Please try again." });
            } else {
                res.render('panel', { type: "success", msg: "Successfully registered. Please login." });
            }
        });
    } else {
        res.redirect('/');
    }
});

// authenticate
router.post('/authenticate', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    User.getUserByUsername(username, function (err,user) {
        if (err)
            throw err;   

        if (!user) {
            res.render('panel', {type: "danger", msg: "User not found. Please register."});
        } else {
            User.comparePassword(password, user.password, function(err, isMatch){
                if (err) 
                    throw err;

                if (isMatch) {
                    res.cookie("user_id", user._id);
                    res.redirect('/users/myfiles');
                } else {
                    res.render('panel', {type: "danger", msg: "Wrong password. Please try again."});
                }
            });
        }
    });
});

// myfiles
router.get('/myfiles', function (req, res, next) {
    User.getUserById(req.cookies['user_id'], function (err, user) {
        if (user != null) {
            console.log(user);
            var directory = './uploads/' + user._id;
            var files = [];

            fs.readdir(directory, function (err, f) {
                if (!err && f.length > 0) {
                    f.forEach(function (file) {
                        files.push({ filename: file });
                    })

                    res.render('myfiles', { logged_in: true, files: files, user: user });            
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
