const mongoose = require('mongoose');

const levelUpRewardSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  rewards: [
    {
      level: { type: Number, required: true },
      roleId: { type: String, required: true },
      message: { type: String, required: true },
    }
  ],
});

module.exports = mongoose.model('LevelUpReward', levelUpRewardSchema);
