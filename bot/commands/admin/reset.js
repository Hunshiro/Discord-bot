const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Level = require('../../models/Level');
const Economy = require('../../models/economy');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      }

      const resetType = interaction.options.getString('reset_type');

      if (!['level', 'balance', 'resetalllevel', 'resetallbalance'].includes(resetType)) {
        return interaction.reply({ content: 'Invalid reset type. Please specify either "level", "balance", "resetalllevel", or "resetallbalance".', ephemeral: true });
      }

      await resetData(interaction, resetType);
    } catch (error) {
      console.error('Error with /reset:', error);
      interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
    }
  },

  name: 'reset',
  description: 'Reset the level or balance of a mentioned member',
  options: [
    {
      name: 'reset_type',
      description: 'Specify whether to reset level or balance',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Level', value: 'level' },
        { name: 'Balance', value: 'balance' },
        { name: 'Reset Daily', value: 'lastdaily' },
        { name: 'Reset All Levels', value: 'resetalllevel' },
        { name: 'Reset All Balances', value: 'resetallbalance' }
      ]
    },
    
    {
      name: 'member',
      description: 'Select member to reset level or balance',
      type: ApplicationCommandOptionType.User,
      required: true,
    }
  ],
};

async function resetData(interaction, resetType) {
  try {
    if (resetType === 'level' || resetType === 'resetalllevel') {
      if (resetType === 'level') {
        const targetMember = interaction.options.getMember('member');
        if (!targetMember) return interaction.reply({ content: 'Please mention a member to reset their level.', ephemeral: true });

        // Reset level data for the mentioned member
        await Level.deleteOne({ userId: targetMember.id });
        interaction.reply({ content: `Successfully reset level for ${targetMember.user.tag}.`, ephemeral: true });
      } else {
        // Reset level data for all members
        await Level.deleteMany({});
        interaction.reply({ content: 'Successfully reset level for all members.', ephemeral: true });
      }
    } else if (resetType === 'balance' || resetType === 'resetallbalance') {
      if (resetType === 'balance') {
        const targetMember = interaction.options.getMember('member');
        if (!targetMember) return interaction.reply({ content: 'Please mention a member to reset their balance.', ephemeral: true });

        // Reset balance data for the mentioned member
        await Economy.deleteOne({ userId: targetMember.id });
        interaction.reply({ content: `Successfully reset balance for ${targetMember.user.tag}.`, ephemeral: true });
      } else {
        // Reset balance data for all members
        await Economy.deleteMany({});
        interaction.reply({ content: 'Successfully reset balance for all members.', ephemeral: true });
      }
    }
  } catch (error) {
    console.error('Error resetting data:', error);
    interaction.reply({ content: 'An error occurred while resetting data.', ephemeral: true });
  }
}
