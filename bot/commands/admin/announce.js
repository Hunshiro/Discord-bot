const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { checkUserPerms } = require('../../utils/checkperms');

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
      const hasAdminPerms = await checkUserPerms(interaction);
      if (!hasAdminPerms) {
        await interaction.reply({
          content: 'You do not have permission to use this command.',
          ephemeral: true,
        });
        return;
      }

      const subcommand = interaction.options.getSubcommand();
      const channel = interaction.options.getChannel('channel');

      if (subcommand === 'create') {
        const title = interaction.options.getString('title');
        const content = interaction.options.getString('content');

        const embed = new EmbedBuilder()
          .setColor("#FF5733")
          .setTitle(title)
          .setDescription(content)
          .setTimestamp();

        await channel.send({ embeds: [embed] });
        await interaction.reply({
          content: 'Announcement created successfully!',
          ephemeral: true,
        });

      } else if (subcommand === 'edit') {
        const messageId = interaction.options.getString('message_id');
        const newContent = interaction.options.getString('new_content');

        try {
          const message = await channel.messages.fetch(messageId);
          if (message) {
            const updatedEmbed = EmbedBuilder.from(message.embeds[0])
              .setDescription(newContent)
              .setTimestamp();

            await message.edit({ embeds: [updatedEmbed] });
            await interaction.reply({
              content: 'Announcement edited successfully!',
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: 'Message not found. Please check the Message ID.',
              ephemeral: true,
            });
          }
        } catch (error) {
          console.error('Error with editing announcement:', error);
          await interaction.reply({
            content: 'Failed to edit announcement. Ensure the Message ID is correct.',
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error('Error with /announcement command:', error);
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true,
      });
    }
  },

  name: 'announcement',
  description: 'Create or edit an announcement in the server',
  options: [
    {
      name: 'create',
      description: 'Create a new announcement',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'title',
          description: 'The title of the announcement',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'content',
          description: 'The content of the announcement',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'channel',
          description: 'The channel to post the announcement in',
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
    {
      name: 'edit',
      description: 'Edit an existing announcement',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'message_id',
          description: 'The ID of the message to edit',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'new_content',
          description: 'The new content for the announcement',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: 'channel',
          description: 'The channel where the announcement is located',
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
  ],
};
