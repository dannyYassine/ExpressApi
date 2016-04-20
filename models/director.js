/**
 * Created by dannyyassine on 2016-04-19.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var directorSchema = new Schema({
    name: String,
    dateOfBirth: String
});

var model = mongoose.model('Director', directorSchema);

module.exports = model;

