var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    PORT = 8080,
    path = require('path'),
    bodyParser = require('body-parser'),
    routes = require('./routes');

// support promise callbacks from db
mongoose.Promise = global.Promise;

// connect to db
// mongoose.connect('mongodb://localhost/dryskate');

// set up static public folder
app.use(express.static(path.join(__dirname, 'public'),{
    extensions:['html']
}));

// call bodyParser middle ware to recieve data
app.use(bodyParser.json());

// route our requests
routes(app);

app.listen(PORT, function(){
    console.log('listening on port '+PORT);
});

module.exports = app;
