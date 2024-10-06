const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

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

    const messageContent = interaction.options.get('message')?.value;

    if (!messageContent) {
      interaction.reply({
        content: 'Please provide a message to send.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const members = await interaction.guild.members.fetch();
    let sentCount = 0;
    let failedCount = 0;

    for (const member of members.values()) {
      if (!member.user.bot) {
        try {
          await member.send(messageContent);
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

  name: 'massdm',
  description: 'Send a direct message to all members in the server',
  options: [
    {
      name: 'message',
      description: 'The message content to send.',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
