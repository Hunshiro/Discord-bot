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

      const randomGif = arrayGif.hug[Math.floor(Math.random() * arrayGif.hug.length)];

      const embed = new EmbedBuilder()
        .setColor('#FFC300')
        .setTitle(`${interaction.user.username} hugged ${targetUserObj.user.username}! cutee...😄`)
        .setImage(randomGif);

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.editReply('An error occurred while processing your command.');
    }
  },

  name: 'hug',
  description: 'hug a user.',
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