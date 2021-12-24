const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    cpf: Number,
    username: String,
    designation: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
      }
    ]
  })
);

module.exports = User;