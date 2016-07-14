var express = require('express');
var app = express();
var apiRoutes = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../api/config'); // get our config file
var User = require('../api/app/models/user'); // get our mongoose model
var Admin = require('../api/app/models/admin'); // get our mongoose model
var client = require('../api/app/models/client');
var likes = require('../api/app/models/likes');
var favorites = require('../api/app/models/favorites');
var categories = require('../api/app/models/categories');
var questions = require('../api/app/models/questions');
var businessTypes = require('../api/app/models/businessType');
var advertisements = require('../api/app/models/advertisements');
var mongoose = require('mongoose');
var url = require('url');
app.set('superSecret', config.secret);
// Load the bcrypt module
var bcrypt = require('bcrypt');
// Generate a salt
//var salt = bcrypt.genSaltSync(10);
var SALT_WORK_FACTOR = 10;
// API ROUTES -------------------
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

apiRoutes.get('/checkEmail', function(req, res) {
	 //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
	var email = req.query.email;
    Admin.findOne({email:email}, function(err, admin) {
	    if (err) {
	        res.json({ status: 102, message: 'Unknown' })
	    } 

        if (!admin) {
            res.json({ status: 102, message: 'Unknown' });
        } 
	    else {
	        res.json({ status: 100, message: 'Ok' })
	    }
    });
});
apiRoutes.get('/userCheckEmail', function(req, res) {
	 //var queryObject = url.parse(req.url,true).query;
  //console.log(queryObject)
	var email = req.query.email;
    User.findOne({email:email}, function(err, user) {
	    if (err) {
	        res.json({ status: 102, message: 'Unknown' })
	    } 

        if (!user) {
            res.json({ status: 100, message: 'ok' });
        } 
	    else {
	        res.json({ status: 101, message: 'Duplicate' })
	    }
    });
});
module.exports = apiRoutes;