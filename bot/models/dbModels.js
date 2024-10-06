const mongoose = require('mongoose');

// Level Schema
const levelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
});

// LevelUpReward Schema
const levelUpRewardSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  rewards: [{
    level: Number,
    roleId: String,
    message: String
  }]
});

// Export models
module.exports = {
  Level: mongoose.models.Level || mongoose.model('Level', levelSchema),
  LevelUpReward: mongoose.models.LevelUpReward || mongoose.model('LevelUpReward', levelUpRewardSchema)
};