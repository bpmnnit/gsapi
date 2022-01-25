const mongoose = require('mongoose');
require('mongoose-long')(mongoose); //For Long Type
const Long = mongoose.Schema.Types.Long;

const peopleSchema = new mongoose.Schema(
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
    userId: String,
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