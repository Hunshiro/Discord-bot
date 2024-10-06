const { Client, Interaction, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Economy = require('../../models/economy');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      const amount = interaction.options.getInteger('amount');
      if (!amount || amount <= 0) {
        await interaction.reply('Please provide a valid positive amount to gamble.');
        return;
      }

      const userEconomy = await Economy.findOne({ userId: interaction.user.id });
      if (!userEconomy || userEconomy.money < amount) {
        await interaction.reply('You don\'t have enough money in your wallet to gamble.');
        return;
      }

      const filter = (i) => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 15000 });

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('heads')
            .setLabel('Heads')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('tails')
            .setLabel('Tails')
            .setStyle(ButtonStyle.Danger)
        );

      await interaction.reply({ content: `Choose heads or tails to gamble ${amount} coins:`, components: [row] });

      collector.on('collect', async (i) => {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const win = i.customId === result;

        const embed = new EmbedBuilder()
          .setColor(win ? '#00FF00' : '#FF0000')
          .setTitle('Coin Flip Result')
          .setDescription(win ? `Congratulations! You won ${amount} coins.` : `Better luck next time! You lost ${amount} coins.`)
          .addFields(win ? { name: 'Result', value: `${result}` } : { name: 'Result', value: `${result}` });

        await i.update({ embeds: [embed], components: [] });

        if (win) {
          userEconomy.money += amount;
        } else {
          userEconomy.money -= amount;
        }

        try {
          await userEconomy.save();
        } catch (error) {
          console.error('Error saving user economy:', error);
          await interaction.followUp('An error occurred while updating your balance.');
        }

        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (collected.size === 0) {
          interaction.editReply('You took too long to make a choice. The gamble has been canceled.');
        }
        // You can also check for the reason if needed
        // if (reason === 'time') console.log('Timed out');
      });
    } catch (error) {
      console.error('Error with /coinflip:', error);
      await interaction.reply('An error occurred while processing your gamble.');
    }
  },
  name: 'coinflip',
  description: 'Gamble your money by flipping a coin',
  options: [
    {
      name: 'amount',
      description: 'The amount to gamble',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    }
  ],
};