// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var mysql = require('mysql');
var favicon = require('serve-favicon');
var compress = require('compression');
var cors = require('cors');
var dbconfig = require('./config/database');

var app = express();
var environment = process.env.NODE_ENV || 'dev';
var settings = {
    port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ipaddress: process.env.OPENSHIFT_NODEJS_IP,
    connection: {}
};

console.log('About to crank up node');
console.log('PORT=' + settings.port);
console.log('NODE_ENV=' + environment);

// database settings
console.log('Configuring database... [' + dbconfig.connection.user + '@' + dbconfig.connection.host + ']');
settings.connection = mysql.createConnection({
    host: dbconfig.connection.host,
    user: dbconfig.connection.user,
    password: dbconfig.connection.password,
    database: dbconfig.database
});

// pass passport for configuration
require('./config/passport')(passport);

// set up our express application =============================================
app.use(compress());
app.use(logger(environment));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'mProjectIsAlwaysRunning'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.set('views', './src/client/views');
        app.use(favicon('./src/client/favicon.ico'));
        break;
}


// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport);
require('./app/apiRouter.js')(app, settings.connection);

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


setupTerminationHandlers();

if (typeof settings.ipaddress === 'undefined') {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
    settings.ipaddress = '127.0.0.1';
}

app.listen(settings.port, settings.ipaddress, function () {
    console.log('%s: Express server listening on %s:%d ...',
        Date(Date.now()), settings.ipaddress, settings.port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});