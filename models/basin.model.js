const mongoose = require('mongoose');
const { Schema } = mongoose;

const basinSchema = new Schema(
  {
  name: String,
  category: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }, {
    timestamps: true,
  }, {
    collection: 'basins'
  }
);

const Basin = mongoose.model(
  'Basin',
  basinSchema
);

module.exports = Basin;