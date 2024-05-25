const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
  } = require('discord.js');
  const {Font , RankCardBuilder} = require('canvacord');
  const canvafy = require('canvafy');
  const calculateLevelXp = require('../../utils/calculateLevelXp');
  const Level = require('../../models/Level');
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      try{
      if (!interaction.inGuild()) {
        interaction.reply('You can only run this command inside a server.');
        return;
      }
  
      await interaction.deferReply();
  
      const mentionedUserId = interaction.options.get('target-user')?.value;
      const targetUserId = mentionedUserId || interaction.member.id;
      const targetUserObj = await interaction.guild.members.fetch(targetUserId);
  
      const fetchedLevel = await Level.findOne({
        userId: targetUserId,
        guildId: interaction.guild.id,
      });
  
      if (!fetchedLevel) {
        interaction.editReply(
          mentionedUserId
            ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
            : "You don't have any levels yet. Chat a little more and try again."
        );
        return;
      }
  
      let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
        '-_id userId level xp'
      );
  
      allLevels.sort((a, b) => {
        if (a.level === b.level) {
          return b.xp - a.xp;
        } else {
          return b.level - a.level;
        }
      });
  
      let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
  
    
        // .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256,dynamic: false,extension: "png" }))
        // .setLevel(fetchedLevel.level)
        // .setRequiredXP(calculateLevelXp(fetchedLevel.level))
        // .setCurrentXP(fetchedLevel.xp) 
        // .setProgressBar('#FFC300', 'COLOR')
        // .setUsername(targetUserObj.user.username)
        // .setDiscriminator(targetUserObj.user.discriminator)
        // .setStatus(targetUserObj.presence.status)
        // .setRank(currentRank)
  
    //     rankCard.build()
    //     .then(data => {
    //         const attachment = new Discord.AttachmentBuilder(data, { name: "RankCard.png" });
    //         interaction.editReply({ files: [attachment] });
    //     });
    // },
    Font.loadDefault();
    const backgroundPath = 'C:/Users/prabh/OneDrive/Desktop/my-discord-bot/bot/assets/level/level2.jpg';

  //   
  const rank = await new canvafy.Rank()
    .setAvatar(targetUserObj.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
    .setBackground("image", backgroundPath)
    .setUsername(targetUserObj.user.username)
    .setBorder("#fff")
    .setBarColor("#FFC300")
   .setStatus(targetUserObj.presence.status)
    .setLevel(fetchedLevel.level)
    .setRank(currentRank)
    .setCurrentXp(fetchedLevel.xp,"#100300") 
    .setRequiredXp(calculateLevelXp(fetchedLevel.level),'#100300')
    .build();

    interaction.editReply({
    files: [{
      attachment: rank,
      name: `rank-${targetUserId}.png`
    }]
  });
  }


catch (err) {
console.error(err);
interaction.editReply('An error occurred while processing your command.');
}

    },

  // image is a buffer. It can be written to a file or sent as an attachment over internet
  
  
    name: 'level',
    description: "Shows your/someone's level.",
    options: [
      {
        name: 'target-user',
        description: 'The user whose level you want to see.',
        type: ApplicationCommandOptionType.Mentionable,
      },
    ],
  


  };
