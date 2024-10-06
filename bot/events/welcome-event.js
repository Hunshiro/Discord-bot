const { EmbedBuilder, ChannelType } = require('discord.js');
const WelcomeSchema = require('../models/welcome'); // Adjust path as needed

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    console.log('New member joined:', member.user.tag);

    try {
      const guildId = member.guild.id;
      const welcomeData = await WelcomeSchema.findOne({ guildId });

      if (!welcomeData) {
        console.log('No welcome data found for this server.');
        return;
      }

      const { channelId, welcomeMessage, dmMessage } = welcomeData;

      // Fetch the channel from the API
      const channel = await member.guild.channels.fetch(channelId).catch(console.error);
      if (!channel) {
        console.log('Channel not found.');
        return;
      }

      // Ensure the channel is a text channel
      if (channel.type !== ChannelType.GuildText) {
        console.log('Channel is not a text channel:', channel.type);
        return;
      }

      // Send a welcome message in the specified channel and ping the new member
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setDescription(`${welcomeMessage} <@${member.id}>`)
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      console.log(`Sent welcome message in channel: ${channel.name}`);

      // Send a DM to the new member
      if (dmMessage) {
        try {
          await member.send(dmMessage);
          console.log('Sent DM to new member.');
        } catch (error) {
          console.error('Could not send DM to new member:', error);
        }
      } else {
        console.log('No DM message set.');
      }
    } catch (error) {
      console.error('Error handling new member:', error);
    }
  });
};
