const mongoose = require('mongoose');
const { Schema } = mongoose;

const surveySchema = new Schema(
  {
    sig: String,
    basin: String,
    region: String,
    area: String,
    fp: String,
    objective: String,
    zoi_depth: String,
    zoi_time: String,
    type: String,
    qow: Number,
    source_type: String,
    spread_type: String,
    bin_size: String,
    gi: Number,
    si: Number,
    rli: Number,
    sli: Number,
    norl: Number,
    rpl: String,
    tac: Number,
    sps: Number,
    fold: Number,
    min_min_offset: Number,
    min_max_offset: Number,
    max_min_offset: Number,
    max_max_offset: Number,
    swath_rollover: String,
    rec_line_bearing: Number,
    ar: Number,
    conversion_factor: Number,
    mgh: Number,
    total_shots: Number,
    rec_inst: String,
    record_length: Number,
    sample_rate: Number,
    rec_format: String,
    sensor: String,
    field_season: String,
    on_off: String,
    start_date: Date,
    end_date: Date,
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  }, {
    timestamps: true,
  }, {
    collection: 'surveys'
  }
);

const Survey = mongoose.model(
  'Survey',
  surveySchema
);

module.exports = Survey;