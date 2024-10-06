const { Client, Interaction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ApplicationCommandOptionType, ButtonStyle ,} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all slash commands with descriptions',
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
        const commands = await interaction.guild.commands.fetch();

        const pageSize = 5; // Number of commands per page
        const page = parseInt(interaction.options.getString('page')) || 1;
  
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, commands.size);
  
        const commandList = Array.from(commands.values())
          .slice(startIndex, endIndex)
          .map(command => `**/${command.name}**: ${command.description || 'No description available'}`)
          .join('\n');

      const embed = new EmbedBuilder()
        .setTitle('Slash Command Help')
        .setDescription(commandList)
        .setColor('#0099ff');

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('prevPage')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1),
          new ButtonBuilder()
            .setCustomId('nextPage')
            .setLabel('Next')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(endIndex === commands.size)
        );

      await interaction.reply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(`Error with /help: ${error}`);
      interaction.reply('An error occurred while processing your request. Please try again later.');
    }
  },
  options: [
    {
      name: 'page',
      description: 'Page number of command list',
      type: ApplicationCommandOptionType.Integer,
      required: false,
    
    },
  ],
};
