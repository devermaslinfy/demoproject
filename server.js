// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./api/config'); // get our config file

/*var likes   = require('../api/app/models/likes');*/
var api = require('./apiRoutes/apiRoutes.js'); // get api routes
var admin = require('./apiRoutes/apiAdmin.js'); // get admin  routes
var url = require('url');
/*var User   = require('./api/app/models/user'); // get our mongoose model
var client   = require('./api/app/models/client');
var favorites   = require('./api/app/models/favorites');
var likes   = require('./api/app/models/likes');
*/
var serveStatic = require('serve-static');


// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
/*app.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});*/
//app.use('/assets', express.static('public'))
app.use(express.static(__dirname + '/public'));

/*app.get('/api', function(req, res) {
     res.json({ message: 'gdffd'})// load the single view file (angular will handle the page changes on the front-end)
});*/

// apply the routes to our application with the prefix /api
app.use('/api', api);
app.use('/admin', admin);
// application -------------------------------------------------------------
app.get('*', function(req, res) {
	app.use(serveStatic(__dirname+ '/public', {'index': ['index.html']}))
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
// =======================
// start the server ======
// =======================
app.listen(port);
//console.log('Magic happens at http://localhost:' + port);
