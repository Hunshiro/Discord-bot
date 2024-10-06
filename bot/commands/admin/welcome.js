const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const WelcomeSchema = require('../../models/welcome'); // Mongoose model for storing welcome messages.

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      if (!interaction.inGuild()) {
        await interaction.reply({
          content: 'You can only run this command inside a server.',
          ephemeral: true,
        });
        return;
      }

      // Check if the user has admin permissions
      const hasAdminPerms = interaction.member.permissions.has('ADMINISTRATOR');
      if (!hasAdminPerms) {
        await interaction.reply({
          content: 'You do not have permission to use this command.',
          ephemeral: true,
        });
        return;
      }

      const subcommand = interaction.options.getSubcommand();

      if (subcommand === 'setup') {
        const welcomeChannel = interaction.options.getChannel('channel');
        const welcomeMessage = interaction.options.getString('message');
        const dmMessage = interaction.options.getString('dm_message');

        await WelcomeSchema.findOneAndUpdate(
          { guildId: interaction.guild.id },
          {
            channelId: welcomeChannel.id,
            welcomeMessage: welcomeMessage,
            dmMessage: dmMessage,
          },
          { upsert: true, new: true }
        );

        await interaction.reply({
          content: `Welcome message set up successfully!\nChannel: ${welcomeChannel}\nMessage: ${welcomeMessage}\nDM Message: ${dmMessage}`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error('Error with /welcome command:', error);
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true,
      });
    }
  },

  name: 'welcome',
  description: 'Set up and manage the welcome message for new members',
  options: [
    {
      name: 'setup',
      description: 'Set up the welcome message and DM message for new members',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: 'The channel to send the welcome message in',
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
        {
          name: 'message',
          description: 'The welcome message to send in the channel',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'dm_message',
          description: 'The DM message to send to the new member',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};

// Listening for new member joining the server

