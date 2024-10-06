
const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, ALLOWED_SIZES } = require('discord.js');
const Bal = require('../../models/economy');

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

    


    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    await interaction.deferReply();

    const user = await Bal.findOne({ userId: targetUserId, guildId: interaction.guild.id });

    if (!user) {
      interaction.editReply(`<@${targetUserId}> doesn't have a profile yet.`);
      return;
    }

 







    const avatarURL = targetUserObj.displayAvatarURL();
    const embed = new EmbedBuilder()
      .setColor("#0E1000")
      .setTitle(`${targetUserObj.user.username}'s balance`)
      .setDescription("Note: wallet and bank details of requested user")
      .setThumbnail(avatarURL)
      .addFields({name:"• Wallet",value:`**\` ${user.money} 🪙 \`**` , inline: true},
      {name:"• Bank",value:`**\` ${user.bank} 🪙 \`**` , inline: true})
      .setFooter({text: 'Use prefix = Rc before running any command'});
    
    interaction.editReply({ embeds: [embed] });
  },

  name: 'balance',
  description: "See yours/someone else's balance",
  options: [
    {
      name: 'user',
      description: 'The user whose balance you want to get.',
      type: ApplicationCommandOptionType.User,
    },
  ],
};