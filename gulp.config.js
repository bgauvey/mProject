module.exports = function() {
    var server = './';
    
    var config = {
        css: server + 'styles/',
        views: server + 'views/',
        /**
         * browser sync
         */
        browserReloadDelay: 1000,
        
        /**
         * Node settings
         */
        defaultPort: 8080,
        nodeServer: server + 'server.js'
    };
    return config;    
};