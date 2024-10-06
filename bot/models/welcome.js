const mongoose = require('mongoose');

const WelcomeSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  welcomeMessage: { type: String, required: true },
  dmMessage: { type: String, required: true },
});

module.exports = mongoose.model('Welcome', WelcomeSchema);
