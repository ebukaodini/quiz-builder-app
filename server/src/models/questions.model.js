const { Schema, model } = require('mongoose');

let schema = Schema({
  quiz: { type: Schema.Types.ObjectId, index: true, required: true, ref: 'Quiz' },
  type: { type: String, default: 'single', enum: ['single', 'multiple'] },
  question: { type: String, required: true },
  answers: [{
    option: { type: String, required: true },
    isAnswer: { type: Boolean, default: false }
  }]
});

module.exports = model("Question", schema);
