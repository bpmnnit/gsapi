const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema(
  {
  title: String,
  description: String,
  userId: String,
  }, {
    timestamps: true,
  }, {
    collection: 'regions'
  }
);

const Region = mongoose.model(
  'Region',
  regionSchema
);

module.exports = Region;