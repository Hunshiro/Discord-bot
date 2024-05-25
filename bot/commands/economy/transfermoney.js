const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Bal = require('../../models/economy');

module.exports = {
  name: 'givemoney',
  description: 'Give money to a mentioned user',
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const userToGive = interaction.options.getUser('user', true);
      const amount = interaction.options.getInteger('amount', true);


      if (amount <= 0) {
        interaction.editReply('Invalid amount. Please specify a positive number.');
        return;
      }

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let sender = await Bal.findOne(query);
      let receiver = await Bal.findOne({ userId: userToGive.id, guildId: interaction.guild.id });

      if (!sender || !receiver) {
        interaction.editReply('One of the users involved in the transaction does not have an economy profile.');
        return;
      }

      if (sender.userId === receiver.userId) {
        interaction.editReply('Please provide a valid user to transfer money to.');
        return;
      }

      if (sender.money < amount) {
        interaction.editReply('You do not have enough money to make this transaction.');
        return;
      }

      sender.money -= amount;
      receiver.money += amount;

      await sender.save();
      await receiver.save();

      const embed = new EmbedBuilder()
        .setTitle('Money Transfer')
        .setDescription(`💸| Successfully transferred ${amount} Noirs to ${userToGive.username}.`)
        .setColor('#00ff00');

      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error with /givemoney: ${error}`);
      interaction.editReply('An error occurred while processing your request. Please try again later.');
    }
  },
  options: [
    {
      name: 'user',
      description: 'The user to give money to',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount of money to give',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};
