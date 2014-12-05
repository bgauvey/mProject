var express = require('./node_modules/express/lib/express');
var app = express();

require('./routes')(app);

app.listen(8001);

console.log("Running on port 8001. . .");