require("dotenv").config();
const { Client,IntentsBitField,EmbedBuilder, userMention } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const welcomeSetup = require('./commands/admin/welcome');
const welcomeEvent = require('./events/welcome-event');
const levelUpEvent = require('./events/levelup-event');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ]});
    (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");
            client.login(process.env.TOKEN_NEW);
            welcomeEvent(client);
            levelUpEvent(client);
        } catch (error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
        }

        
         
        eventHandler(client);
    })();
    
   
  
