const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = mongoose.model(
  'User',
  new Schema({
    cpf: Number,
    username: String,
    designation: String,
    email: String,
    password: String,
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  })
);

module.exports = User;