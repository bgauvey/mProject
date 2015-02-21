// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var mysql = require('mysql');

var app = express();
var dbconfig = require('./config/database');


var settings = {
    port: process.env.OPENSHIFT_NODEJS_PORT || 8001,
    dbHost: dbconfig.connection.host,
    dbUser: dbconfig.connection.user,
    dbPass: dbconfig.connection.password,
    ipaddress: process.env.OPENSHIFT_NODEJS_IP,
    connection: {}
};
// configuration ===============================================================
// connect to our database
function connectDb () {
        settings.connection = mysql.createConnection(dbconfig.connection);;
    }
console.log('Connecting to mySql ... [' + dbconfig.connection.user + '@' + dbconfig.connection.host + ']');
connectDb();
// pass passport for configuration
require('./config/passport')(passport); 

// set up our express application =============================================

// log every request to the console
app.use(morgan('dev')); 
// read cookies (needed for auth)
app.use(cookieParser());
// get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// set up ejs for templating
app.set('view engine', 'ejs'); 

// required for passport
// session secret
app.use(session({
    resave: true, 
    saveUninitialized: true,
    secret: 'mProjectIsAlwaysRunning'
}));

app.use(passport.initialize());
// persistent login sessions
app.use(passport.session()); 
// use connect-flash for flash messages stored in session
app.use(flash()); 

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport); 
    
// =====================================
// API ROUTER ==========================
// =====================================
app.use('/api', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
//create the express router
var router = express.Router();

// Initial dummy route for testing /api
router.get('/', isLoggedIn, function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('api.ejs', { message: null });
});

// Register all our routes with /api prefix
app.use('/api', router);

// Add the handlers for the api
require('./api/ingredients')(router, settings.connection);   

// launch ======================================================================
/**
 *  terminator === the termination handler
 *  Terminate server on receipt of the specified signal.
 *  @param {string} sig  Signal to terminate on.
 */
function terminator(sig) {
    if (typeof sig === 'string') {
        console.log('%s: Received %s - terminating mProject ...',
            Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
}


/**
 *  Setup termination handlers (for exit and a list of signals).
 */
function setupTerminationHandlers() {
    //  Process on exit and signals.
    process.on('exit', function () {
        terminator();
    });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function (element, index, array) {
        process.on(element, function () {
            terminator(element);
        });
    });
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		return next();
    }

	// if they aren't redirect them to the home page
	res.redirect('/');
}

setupTerminationHandlers();

if (typeof settings.ipaddress === 'undefined') {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    settings.ipaddress = '127.0.0.1';
}

app.listen(settings.port, settings.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), settings.ipaddress, settings.port);
});