const mongoose = require('mongoose');
require('mongoose-long')(mongoose); //For Long Type
const Long = mongoose.Schema.Types.Long;
const { Schema } = mongoose;

const peopleSchema = new Schema(
  {
    cpf: Number,
    name: String,
    email: String,
    designation: String,
    discipline: String,
    charge: String,
    level: String,
    mobile: Long,
    crc: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }, {
    timestamps: true,
  }, {
    collection: 'peoples'
  }
);

const People = mongoose.model(
  'People',
  peopleSchema
);

module.exports = People;