var Movie = require('../models/movie');
var Director = require('../models/director');
var express = require('express');
var router = express.Router();

router.route('/movies')
    .get(function (req, res) {
        Movie.find(function (err, movies) {
            if (err) {
                return res.send(err);
            }

            res.json(movies);
        });
    })
    .post(function (req, res) {
        var movie = new Movie(req.body);

        movie.save(function (err) {
            if (err) {
                return res.send(err);
            }

            res.send({message: 'Movie Added'});
        });
    });

router.route('/movies/:id')
    .put(function (req, res) {
        Movie.findOne({_id: req.params.id}, function (err, movie) {
            if (err) {
                return res.send(err);
            }

            for (prop in req.body) {
                movie[prop] = req.body[prop];
            }

            // save the movie
            movie.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                res.json({message: 'Movie updated!'});
            });
        });
    })
    .delete(function (req, res) {
        Movie.remove({
            _id: req.params.id
        }, function (err, movie) {
            if (err) {
                return res.send(err);
            }

            res.json({message: 'Successfully deleted'});
        });
    })
    .get(function(req, res) {
        Movie.findOne({ _id: req.params.id}, function(err, movie) {
            if (err) {
                return res.send(err);
            }

            res.json(movie);
        });
    });

router.route('/movies/:id/associate')
    .put(function(request, response){

        Movie.findOne({_id: request.params.id}, function(error, movie){

            if (error || request.body['director'] == null) {
                return response.send({"error": 400});
            } else {

                Director.findOne({_id: request.body.director}, function(error, director){

                    if (error) {
                        return response.send({"error": 400});
                    } else {

                        movie["director"] = {
                            "$id": director._id,
                            "$ref": "directors"
                        };

                        movie.save(function(error) {
                            if (error) {
                                return response.send(error);
                            }

                            response.json({message: 'Director added!', 'data': movie});
                        });

                    }

                });

            }

        });

    });

module.exports = router;