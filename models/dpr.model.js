const mongoose = require('mongoose');
const { Schema } = mongoose;

const dprSchema = new Schema(
  {
    sig: String,
    area: String,
    region: String,
    type: String,
    date: Date,
    fp: String,
    acc: Number,
    rej: Number,
    skp: Number,
    rep: Number,
    rec: Number,
    cov_shots: Number,
    coverage: Number,
    remarks: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }, {
    timestamps: true,
  }, {
    collection: 'dprs'
  }
);

const Dpr = mongoose.model(
  'Dpr',
  dprSchema
);

module.exports = Dpr;