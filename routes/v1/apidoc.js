/**
 * Created by dannyyassine on 2016-04-20.
 */

var express = require('express');
var router = express.Router();
var path = require('path');
var fs           = require('fs');
contentTypes = require('../../utils/content-types');

router.get('/', function(request, response) {

    fs.readFile(__dirname+'../../web/' + 'index.html', function (err, data) {
        if (err) {
            console.log(err);
            response.writeHead(404);
            response.end();
        } else {
            var ext = path.extname(url).slice(1);
            response.setHeader('Content-Type', contentTypes[ext]);
            if (ext === 'html') {
                response.setHeader('Cache-Control', 'no-cache, no-store');
            }
            console.log(data);
            response.end(data);
        }
    });

});

module.exports = router;