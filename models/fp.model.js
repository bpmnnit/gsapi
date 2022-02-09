const mongoose = require('mongoose');
const { Schema } = mongoose;

const fpSchema = new Schema(
  {
    name: String,
    type: String,
    region: { type: Schema.Types.ObjectId, ref:'Region' },
    chief: { type: Schema.Types.ObjectId, ref: 'People' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }, {
    timestamps: true,
  }, {
    collection: 'fps'
  }
);

const Fp = mongoose.model(
  'Fp',
  fpSchema
);

module.exports = Fp;