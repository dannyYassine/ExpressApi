var Movie = require('../../models/movie');
var Director = require('../../models/director');
var express = require('express');
var router = express.Router();

router.route('/movies')
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
    .get(function (req, res) {
        Movie.find(function (err, movies) {
            if (err) {
                return res.send(err);
            }

            res.json(movies);
        });
    })
    .post(function (request, response) {

        if (request.body.title == null || request.body.releaseYear == null || request.body.director == null || request.body.genre == null) {
            response.status(400).json({'error': 'Missing body arguments'});
        }

        var movie = new Movie(request.body);

        movie.save(function (error) {
            if (error) {
                return response.status(400).json(error);
            }

            response.send({message: 'Movie Added'});
        });
    });

router.route('/movies/:id')
    .put(function (req, res) {
        Movie.findOne({_id: req.params.id}, function (error, movie) {
            if (error) {
                return response.status(400).json(error);
            }

            for (prop in req.body) {
                movie[prop] = req.body[prop];
            }

            // save the movie
            movie.save(function (err) {
                if (err) {
                    return response.status(400).json(err);
                }

                res.json({message: 'Movie updated!'});
            });
        });
    })
    .delete(function (req, res) {
        Movie.remove({
            _id: req.params.id
        }, function (error, movie) {
            if (error) {
                return response.status(400).json(error);
            }

            res.json({message: 'Successfully deleted'});
        });
    })
    .get(function(req, res) {
        Movie.findOne({ _id: req.params.id}, function(error, movie) {
            if (error) {
                return response.status(400).json(error);
            }

            res.json(movie);
        });
    });

router.route('/movies/:id/associate')
    .put(function(request, response){

        Movie.findOne({_id: request.params.id}, function(error, movie){

            if (error || request.body['director'] == null) {
                return response.status(400).json(error);
            } else {

                Director.findOne({_id: request.body.director}, function(error, director){

                    if (error) {
                        return response.status(400).json(error);
                    } else {

                        movie["director"] = {
                            "$id": director._id,
                            "$ref": "directors"
                        };

                        movie.save(function(error) {
                            if (error) {
                                return response.status(400).json(error);
                            }

                            response.json({message: 'Director added!', 'data': movie});
                        });

                    }

                });

            }

        });

    });

module.exports = router;