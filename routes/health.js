/**
 * Created by dannyyassine on 2016-04-19.
 */

var router = require('express').Router();


router.route('/health')
    .get(function(request, response) {

        response.writeHead(200);
        response.end();

    });

module.exports = router;