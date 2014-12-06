var express = require('express');
var mysql = require('mysql');

var app = express();

var dbHost = process.env.OPENSHIFT_MYSQL_DB_HOST;
var dbUser = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
var dbPass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;
var ipaddr = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port   = parseInt(process.env.OPENSHIFT_INTERNAL_PORT) || 8001;

var connection = mysql.createConnection({
    host : 'fas-bgauvey.rhcloud.com',
    user : 'admin3FUHCpU',
    database : 'fas',
    password : 'H_CJDelXKm74'
});

require('./routes')(app);

app.listen(port, ipaddr);

console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddr, port);