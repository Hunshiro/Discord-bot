const { Schema, model } = require('mongoose');

const economySchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    default: 0,
  },
  bank: {
    type: Number,
    default: 0,
  },
  lastDaily: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  lastJobTime: {
    type: Date, // Store the timestamp of the last job done by the user
    default: 0,
    required:true, // Initially, there's no last job time
  },
  // You can add more fields here for job-related data if needed
});

module.exports = model('Economy', economySchema);
