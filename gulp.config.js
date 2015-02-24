module.exports = function() {
    var server = './src/server/';
    var client = './src/client/';

    var config = {
        css: client + 'styles/',
        views: client + 'views/',
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