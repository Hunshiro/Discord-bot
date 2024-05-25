const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
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
        await interaction.reply('Please provide a valid positive amount to deposit.');
        return;
      }

      await interaction.deferReply();

      await updateWalletToBank(interaction, amount);

      await interaction.editReply(`Successfully withdrawn ${amount} from bank to wallet.`);
    } catch (error) {
      console.error('Error with /deposit:', error);
      await interaction.reply('An error occurred while processing your deposit.');
    }
  },

  name: 'withdraw',
  description: 'Withdraw money from bank to wallet',
  options: [
    {
      name: 'amount',
      description: 'The amount to deposit',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};

async function updateWalletToBank(interaction, amount) {
  const userEconomy = await Economy.findOne({ userId: interaction.user.id });

  if (!userEconomy) {
    // Handle if user doesn't have an economy entry
    return;
  }

  if (userEconomy.bank< amount) {
    await interaction.reply('oops..! poor bank balance...😭');
    return;
  }

  userEconomy.bank-= amount;
  userEconomy.money += amount;

  await userEconomy.save();
}
