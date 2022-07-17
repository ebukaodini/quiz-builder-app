const { Schema, model } = require('mongoose');

let schema = Schema({
  user: { type: Schema.Types.ObjectId, index: true, required: true, ref: 'User' },
  title: { type: String, required: true },
  permalink: { type: String, required: true, unique: true },
  attempt: { type: Number, default: 0 }, // the number of times the quiz have been attempted
  created: { type: Date, default: Date.now }
});

module.exports = model("Quiz", schema);
