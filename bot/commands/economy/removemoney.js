const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { checkUserPerms } = require('../../utils/checkperms');
const Economy = require('../../models/economy');

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

      const targetUser = interaction.options.getUser('user');
      const amountToRemove = interaction.options.getInteger('amount');

      if (!targetUser || !amountToRemove) {
        await interaction.reply({
          content: 'Please provide a valid user and amount.',
          ephemeral: true,
        });
        return;
      }

      const economyEntry = await Economy.findOneAndUpdate(
        { userId: targetUser.id, guildId: interaction.guild.id },
        { $inc: { money: -amountToRemove } }, // Decrement money by the specified amount
        { new: true, upsert: true }
      );

      const embed = new EmbedBuilder()
        .setColor("#0E1000")
        .setTitle(`✅ | Successfully removed ${amountToRemove} from ${targetUser.tag}'s account.`)
        .setDescription(`💰 | New balance: ${economyEntry.money}`)
        .setThumbnail("https://i.postimg.cc/4yYXKh2q/Designer.jpg")
        .setFooter({text: 'Use /balance command to check your balance'});

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error with /removemoney:', error);
    }
  },

  name: 'removemoney',
  description: 'Remove money from a user\'s account',
  options: [
    {
      name: 'user',
      description: 'The user from whom you want to remove money',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount of money to remove',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};
