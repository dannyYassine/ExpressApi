const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env;

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var movies = require('./routes/movies'); //routes are defined here
var directors = require('./routes/directors');
var apidoc = require('./routes/apidoc');
var health = require('./routes/health');
var app = express(); //Create the Express app

// DATABASE CONNECTION

var dbName = 'test_api';
var connectionString = 'mongodb://dannyyassine:dannyyassine@ds017070.mlab.com:17070/' + dbName;
mongoose.connect(connectionString);

// ADDING DEFAULT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// MIDDLEWARE

if (!env.NODE_ENV) {
    app.use(function (req, res, next) {
        console.log('Time:', Date.now());
        next();
    });
}


// ROUTES

app.use('/api', movies); //This is our route middleware
app.use('/api', directors);
app.use('/api', apidoc);

// Open Shift EndPoints

app.use('/', function(req, res) {

    var url = req.url;
    if (url == '/') {
        url += 'index.html';
    }

    // IMPORTANT: Your application HAS to respond to GET /health with status 200
    //            for OpenShift health monitoring

    if (url == '/health') {
        res.writeHead(200);
        res.end();
    } else if (url.indexOf('/info/') == 0) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.end(JSON.stringify(sysInfo[url.slice(6)]()));
    } else {
        fs.readFile('./static' + url, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end();
            } else {
                var ext = path.extname(url).slice(1);
                res.setHeader('Content-Type', contentTypes[ext]);
                if (ext === 'html') {
                    res.setHeader('Cache-Control', 'no-cache, no-store');
                }
                res.end(data);
            }
        });
    }

});

app.set('port', process.env.PORT || 8000);

var server = app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
    console.log('Express server listening on port ' + server.address().port);
});
