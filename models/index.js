const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.region = require('./region.model');
db.people = require('./people.model');
db.basin = require('./basin.model');
db.fp = require('./fp.model');
db.survey = require('./survey.model');
db.dpr = require('./dpr.model');

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;