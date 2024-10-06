const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    const embedTitle = interaction.options.get('title')?.value;
    const embedDescription = interaction.options.get('description')?.value;
    const embedColor = interaction.options.get('color')?.value || '#00FF00'; // Default color

    if (!embedTitle || !embedDescription) {
      interaction.reply({
        content: 'Please provide both a title and description for the embed.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const members = await interaction.guild.members.fetch();
    let sentCount = 0;
    let failedCount = 0;

    const embed = new EmbedBuilder()
      .setTitle(embedTitle)
      .setDescription(embedDescription)
      .setColor(embedColor);

    for (const member of members.values()) {
      if (!member.user.bot) {
        try {
          await member.send({ embeds: [embed] });
          sentCount++;
        } catch (error) {
          console.error(`Failed to send DM to ${member.user.tag}:`, error);
          failedCount++;
        }
      }
    }

    interaction.editReply({
      content: `Mass DM sent! Successfully sent to ${sentCount} members. Failed to send to ${failedCount} members.`,
      ephemeral: true,
    });
  },

  name: 'embedmassdm',
  description: 'Send an embedded direct message to all members in the server',
  options: [
    {
      name: 'title',
      description: 'The title of the embed.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'description',
      description: 'The description of the embed.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'color',
      description: 'The color of the embed in hex format (e.g., #FF0000).',
      type: ApplicationCommandOptionType.String,
    },
  ],
};
