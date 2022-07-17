const { Schema, model } = require('mongoose');

let schema = Schema({
  firstname: String,
  lastname: String,
  email: { type: String, index: true, unique: true },
  password: String,
  created: { type: Date, default: Date.now }
});

module.exports = model("User", schema);
