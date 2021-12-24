const mongoose = require('mongoose');

const Region = mongoose.model(
  'Region',
  new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
  })
);

module.exports = Region;