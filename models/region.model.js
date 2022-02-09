const mongoose = require('mongoose');
const { Schema } = mongoose;
const regionSchema = new Schema(
  {
  title: String,
  description: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
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