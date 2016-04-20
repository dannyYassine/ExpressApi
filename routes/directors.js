/**
 * Created by dannyyassine on 2016-04-19.
 */

var Directory = require('../models/director');
var express = require('express');
var router = express.Router();

router.route('/directors')
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