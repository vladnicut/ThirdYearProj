var express = require('express');
var mustacheExpress = require('mustache-express');
var cookieParser = require('cookie-parser');

var fs = require('fs');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var config = require('./config/database');

var index = require('./routes/index');
var users = require('./routes/users');

var port = 3000

// initialize app
var app = express();
app.use(cookieParser());

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// register mustache with express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// connect to mongoose database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

//on connection
mongoose.connection.on('connected', function(){
    console.log('Connected to the database'+ config.database);
});

//on error
mongoose.connection.on('error', function(err){
    console.log('Database error'+ err);
});

// routes
app.use('/', index);
app.use('/users', users);

app.listen(port, function(){
    console.log('Server started on port' + port);
});





conceptual 






