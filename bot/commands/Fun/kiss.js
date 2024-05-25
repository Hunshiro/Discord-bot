const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const arrayGif = require('../../utils/gifLinks');


module.exports = {
  /**
   * Executes the hug command.
   * @param {Client} client The Discord client.
   * @param {Interaction} interaction The interaction data.
   */
  callback: async (client, interaction) => {
    try {
       // Get custom prefix
      await interaction.deferReply();

      const targetUserId = interaction.options.get('user').value;
      const targetUserObj = await interaction.guild.members.fetch(targetUserId);

      const randomGif = arrayGif.kiss[Math.floor(Math.random() * arrayGif.kiss.length)];

      const embed = new EmbedBuilder()
        .setColor('#FFC300')
        .setTitle(`${interaction.user.username} kissed ${targetUserObj.user.username}! ommggg..🥵`)
        .setImage(randomGif);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.editReply('An error occurred while processing your command.');
    }
  },

  name: 'kiss',
  description: 'kiss a user.',
  options: [
    {
      name: 'user',
      description: 'The user you want to hug.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],
};