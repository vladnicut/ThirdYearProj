var jsonfile = require('jsonfile')
var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var mv = require('mv');
var path = require('path');
var markov_chain = require('markovchain');

var uuid = require('node-uuid');
var uploaded_filename = uuid.v4() + '.csv';

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/public')
	},
	filename: function(req, file, cb) {
		cb(null, uploaded_filename);    
	}
});

var upload = multer({ storage: storage });

// index
router.get('/', function(req, res, next) {
    var logged_in = false;

    if (req.cookies['user_id'] != null) {
        logged_in = true;
    }

    res.render('index', { logged_in: logged_in });
});

router.post('/edgebundling', function (req, res, next) {
    var logged_in = false;
    var mc = new markov_chain(req.body.sequence);

    if (req.cookies['user_id'] != null) logged_in = true;

    var some_data = [];
    var some_index = 0;

    for (var index in mc.wordBank) {
        some_data.push({"name": index, size: 1, "imports": []});

        var total = 0;
        for (var i in mc.wordBank[index]) {
            some_data[some_index].imports.push(i);
            total += mc.wordBank[index][i];
        }

        for (var _index in mc.wordBank[index]) {
            mc.wordBank[index][_index] = mc.wordBank[index][_index] / total;
        }

        some_index++;
    }

 
    var file = path.resolve(__dirname, '../uploads/x.json');
    
    jsonfile.writeFile(file, some_data, function (err) {
        console.error(err);
    });

    res.render('edgebundling', { logged_in: logged_in });
});

// upload
router.post('/', upload.any(), function (req, res, next) {
	console.log(req.files);
    
    var logged_in = false;

    if (req.cookies['user_id'] != null) {
        logged_in = true;
    }
    
    if (req.cookies['user_id'] != null) {
        var dir = './uploads/' + req.cookies['user_id'];

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        mv('uploads/public/' + req.files[0].filename, 
           'uploads/' + req.cookies['user_id'] + '/' + req.files[0].filename, function(err) {
            console.log(err);
        });

        res.redirect('/?folder=' + req.cookies['user_id'] +
                '&filename=' + req.files[0].filename + "&name=" + req.files[0].originalname);   
    } else {
        res.redirect('/?folder=public&filename=' + req.files[0].filename + "&name=" + req.files[0].originalname);
    }
});

router.get('/logout', function (req, res) {
    res.clearCookie('user_id');
    res.redirect('/');
});

module.exports = router;
