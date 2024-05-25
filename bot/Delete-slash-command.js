const { Client,IntentsBitField,EmbedBuilder, userMention } = require('discord.js');
const arrayGif = require('./utils/gifLinks');
const fs = require("fs");
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]});



    require("dotenv").config();
    client.on("ready", async(c) =>{
        console.log(`✅ ${c.user.tag} is ready to go online`)
        client.user.setActivity({
            name: `Exploring cave with your mom🥵`,
        });
        try {
          // Fetch the command to get its ID
          const commandId = '1224747511366025237'; // Replace 'YOUR_COMMAND_ID' with the ID of the command to delete
          const command = await client.guilds.cache.get('1222576391091126272')?.commands.fetch(commandId);
  
          // Delete the command
          if (command) {
              await command.delete();
              console.log('Command deleted successfully.');
          } else {
              console.log('Command not found.');
          }
      } catch (error) {
          console.error('Error deleting command:', error);
      }
    });


    client.login(process.env.TOKEN);