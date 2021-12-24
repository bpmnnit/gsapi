const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regionSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  userId: {
    type: String
  },
}, { 
  timestamps: true
}, {
  collection: 'regions'
});

module.exports = mongoose.model('regions', regionSchema);