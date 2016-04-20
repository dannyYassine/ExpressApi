/**
 * Created by dannyyassine on 2016-04-20.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {

    response.sendFile('index.html');

});

module.exports = router;