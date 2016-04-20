/**
 * Created by dannyyassine on 2016-04-19.
 */

var Directory = require('../models/director');
var express = require('express');
var router = express.Router();

router.route('/directors')
    .all(function(request, response, next) {

        // Check for authentication
        if (request.query.pass == null) {
            response.status(400).json({'error': 'Please enter the pass parameter'});
        } else if (request.query.pass != 'swift') {
            response.send({'error': 'Invalid pass parameter'});
            response.end();
        } else {
            next();
        }

    })
    .get(function (request, response) {

        Directory.find(function (error, directors) {

            if (error == null) {
                return response.json(directors);
            } else {
                response.send({'error': 400});
            }

        });

    })
    .post(function (request, response) {

        var director = new Directory(response.body);

        director.save(function(error){

            if (error) {
                return response.send({'error': 400});
            } else {
                return response.send({'statusCode': 200});
            }

        });

    });

module.exports = router;