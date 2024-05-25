const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder,AttachmentBuilder } = require('discord.js');
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
      const amountToAdd = interaction.options.getInteger('amount');

      if (!targetUser || !amountToAdd) {
        await interaction.reply({
          content: 'Please provide a valid user and amount.',
          ephemeral: true,
        });
        return;
      }

      const economyEntry = await Economy.findOneAndUpdate(
        { userId: targetUser.id, guildId: interaction.guild.id },
        { $inc: { money: amountToAdd } }, // Decrement money by the specified amount
        { new: true, upsert: true }
      );
      const file = new AttachmentBuilder('C:/Users/prabh/OneDrive/Desktop/my-discord-bot/bot/assets/level/level1.jpg')
      const embed = new EmbedBuilder()
        .setColor("#0E1000")
        .setTitle(`✅ | Successfully add ${amountToAdd} to ${targetUser.tag}'s account.`)
        .setDescription(`💰 | New balance: ${economyEntry.money}`)
        .setThumbnail('https://i.postimg.cc/8cXs9SxQ/Designer-4.jpg')
        .setFooter({text: "Use /balance command to check your balance"});

      await interaction.reply({ embeds: [embed]});
    } catch (error) {
      console.error('Error with /removemoney:', error);
    }
  },

  name: 'add-money',
  description: 'Add money from a user\'s account',
  options: [
    {
      name: 'user',
      description: 'The user from whom you want to remove money',
      type: ApplicationCommandOptionType.User,
      required: true,
      
    },
    {
      name: 'amount',
      description: 'The amount of money to add',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};
