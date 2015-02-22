// app/apiRouter.js
module.exports = function(app, connection) {
    var express = require('express');

    // =====================================
    // API ROUTER ==========================
    // =====================================
    
    //create the express router
    var router = express.Router();
    
    app.use('/api', function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });

    // Initial dummy route for testing /api
    router.get('/', isLoggedIn, function (req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.render('api.jade', { message: null });
    });

    // Register all our routes with /api prefix
    app.use('/api', router);

    // Add the handlers for the api
    require('../api/ingredients')(router, connection);   
};


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		return next();
    }

	// if they aren't redirect them to the home page
	res.redirect('/login');
}