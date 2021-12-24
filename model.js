const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const atlas_2dSchema = new Schema({
  sig: {
    type: String
  },
  area: {
    type: String
  },
  volume: {
    type: Number
  },
  year: {
    type: String
  },
  party_type: {
    type: String
  },
  party_details: {
    type: String
  },
  spread_type: {
    type: String
  },
  group_interval: {
    type: Number
  },
  shot_interval: {
    type: Number
  },
  active_channels: {
    type: Number
  },
  fold: {
    type: Number
  },
  max_offset: {
    type: Number
  },
  location_map: {
    type: String
  },
  coverage_map: {
    type: String
  },
  processed_section: {
    type: String
  }
}, {
  collection: 'atlas_2d'
});

module.exports = mongoose.model('Atlas_2D', atlas_2dSchema);