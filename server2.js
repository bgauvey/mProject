//#!/bin/env node

var express    = require('express');
var fs         = require('fs');
var mysql      = require('mysql');
var passport   = require('passport');
var flash      = require('connect-flash');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var morgan     = require('morgan');

var dbconfig = require('./config/database');
require('./config/passport')(passport); // pass passport for configuration

var mProject = function () {
    'use strict';

    // Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.dbHost = process.env.OPENSHIFT_MYSQL_DB_HOST || dbconfig.connection.host;
        self.dbUser = process.env.OPENSHIFT_MYSQL_DB_USERNAME || dbconfig.connection.user;
        self.dbPass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || dbconfig.connection.password;
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === 'undefined') {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = '127.0.0.1';
        }
    };

    /**
     * Set up the database connection
     */
    self.connectDb = function () {
        self.connection = mysql.createConnection({
            host: self.dbHost,
            user: self.dbUser,
            password: self.dbPass,
            database: dbconfig.database
        });
    };

    /**
     * Set up the security for the api pages
     */
    self.setupPassport = function () {
        self.app = express();
        self.app.use(cookieSession({ secret: 'vidyapathaisalwaysrunning' } )); // session secret
	    self.app.use(passport.initialize());
	    self.app.use(passport.session()); // persistent login sessions
	    self.app.use(flash()); // use connect-flash for flash messages stored in session
    };

    /**
     *  Populate the cache.
     */
    self.populateCache = function () {
        if (typeof self.zcache === 'undefined') {
            self.zcache = [{
                'index.html': ''
            }, {
                'api.html': ''
            }];
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
        self.zcache['api.html'] = fs.readFileSync('./views/api.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cacheGet = function (key) {
        return self.zcache[key];
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === 'string') {
            console.log('%s: Received %s - terminating mProject ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
            ].forEach(function (element, index, array) {
            process.on(element, function () {
                self.terminator(element);
            });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {
        self.app = express();
        
        // log every request to the console
        self.app.use(morgan('combined')); 
        
        // use connect-flash for flash messages stored in session
        self.app.use(flash);
        
        self.app.use(bodyParser.urlencoded({
            extended: true
        }));
        self.app.use(bodyParser.json());

        self.app.set('view engine', 'ejs'); // set up ejs for templating
        
        self.app.disable('etag');
        
        self.app.use('/api', function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        });
        
        /*
        var home = express.Router();
        home.get('/', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cacheGet('index.html'));
        });
        self.app.use('/', home);
*/
        //create the express router
        var router = express.Router();

        // Initial dummy route for testing /api
        router.get('/', function (req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cacheGet('api.html'));
        });

        // Register all our routes with /api prefix
        self.app.use('/api', router);
 
        
        // Add the handlers for the api
        require('./routes/ingredients')(router, self.connection);
    };


    /**
     *  Initializes the application.
     */
    self.initialize = function () {
        self.setupVariables();
       // self.populateCache();
        self.setupTerminationHandlers();
        self.connectDb();
        self.setupPassport();
        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server.
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

}; /*  mProject Application.  */


/**
 *  main():  Main code.
 */
var zapp = new mProject();
zapp.initialize();
zapp.start();