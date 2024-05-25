
const canvafy = require('canvafy');
const { ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const path = require('path');
const{calculateShipPercentage, determineShipStatus} = require('../../utils/shiputils');
const{getRandomBackgroundImage}=require('../../utils/getRBg');  
const ASSET_FOLDER_PATH = './bot/assets/ship/';
module.exports = {
    /**
     * Executes the hug command.
     * @param {Client} client The Discord client.
     * @param {Interaction} interaction The interaction data.
     * 
     */


      
    callback: async (client, interaction) => {
      try {
         // Get custom prefix
        await interaction.deferReply();
        const targetUserId1 = interaction.options.get('user1').value;
        const targetUserId2 = interaction.options.get('user2').value;
        const targetUserObj1 = await interaction.guild.members.fetch(targetUserId1);
        const targetUserObj2 = await interaction.guild.members.fetch(targetUserId2);
        const randomBackgroundImage = getRandomBackgroundImage(ASSET_FOLDER_PATH);
        const serverNickname = interaction.member.nickname;
        const shipPercentage = calculateShipPercentage(targetUserObj1.user.username, targetUserObj2.user.username, serverNickname);
        const shipStatus = determineShipStatus(shipPercentage);
        if (!targetUserObj1 || !targetUserObj2) {
            interaction.editReply('Invalid user(s).');
          } else {
            const ship = await new canvafy.Ship()
              .setAvatars(targetUserObj1.user.displayAvatarURL({ forceStatic: true, extension: "png"}), targetUserObj2.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
              .setBackground("image", randomBackgroundImage )
              .setBorder("#f0f0f0")
              .setOverlayOpacity(0.5)
              .setCustomNumber(shipPercentage)
              .build();
    
            interaction.editReply({
                content: `Ship Status: ${shipStatus}`,
              files: [{
                attachment: ship,
                name: `ship-${targetUserObj1.user.username}-${targetUserObj2.user.username}.png`
              }]
            });
          }
        } catch (err) {
          console.error(err);
          interaction.editReply('An error occurred while processing your command.');
        }
      },
    
  
    
  
    name: 'ship',
    description: 'ship two users together.',
    options: [
      {
        name: 'user1',
        description: 'The first user.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'user2',
        description: 'The second user.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.SendMessages],
    botPermissions: [PermissionFlagsBits.SendMessages],
  };
   






