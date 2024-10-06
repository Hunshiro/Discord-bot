// const { Client, ChannelType, PermissionsBitField } = require('discord.js');
// const { Level, LevelUpReward } = require('../models/dbModels'); // Adjust the path as needed

// module.exports = (client) => {
//   client.on('messageCreate', async (message) => {
//     if (message.author.bot || !message.guild) return;

//     const { guild, author, member } = message;

//     try {
//       // Find or create the user's level document
//       let userLevel = await Level.findOne({ userId: author.id, guildId: guild.id });
//       if (!userLevel) {
//         userLevel = new Level({ userId: author.id, guildId: guild.id });
//       }

//       const oldLevel = userLevel.level;

//       // Calculate XP gain (you can adjust this logic as needed)
//       const xpGain = Math.floor(Math.random() * 10) + 15;
//       userLevel.xp += xpGain;

//       // Check if user has leveled up
//       const newLevel = Math.floor(0.1 * Math.sqrt(userLevel.xp));
//       if (newLevel > oldLevel) {
//         userLevel.level = newLevel;
//         await userLevel.save();

//         console.log(`User Level Up: ${author.tag} leveled up from ${oldLevel} to ${newLevel}`);

//         // Fetch level-up rewards for this guild
//         const guildData = await LevelUpReward.findOne({ guildId: guild.id });

//         if (guildData && guildData.rewards.length > 0) {
//           // Find all eligible rewards
//           const eligibleRewards = guildData.rewards
//             .filter(reward => reward.level > oldLevel && reward.level <= newLevel)
//             .sort((a, b) => a.level - b.level);

//           for (const reward of eligibleRewards) {
//             const { level, roleId, message } = reward;
//             const role = guild.roles.cache.get(roleId);

//             if (role) {
//               // Check if the bot has permissions to manage roles
//               if (guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
//                 // Check if the bot's role is higher than the role it's trying to assign
//                 if (guild.members.me.roles.highest.position > role.position) {
//                   // Check if the member already has the role
//                   if (!member.roles.cache.has(roleId)) {
//                     await member.roles.add(role);
//                     console.log(`Assigned role ${role.name} to ${author.tag} for reaching level ${level}`);

//                     // Send a message to the channel
//                     const channel = guild.systemChannel || guild.channels.cache.find(ch => 
//                       ch.type === ChannelType.GuildText && 
//                       ch.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)
//                     );

//                     if (channel) {
//                       await channel.send(`${member}, ${message}`);
//                       console.log(`Sent level-up message to channel: ${channel.name} for level ${level}`);
//                     } else {
//                       console.log(`No suitable channel found for sending the level-up message for level ${level}`);
//                     }
//                   } else {
//                     console.log(`${author.tag} already has the role for level ${level}`);
//                   }
//                 } else {
//                   console.log(`Bot's highest role is not high enough to assign the role for level ${level}`);
//                 }
//               } else {
//                 console.log('Bot does not have permission to manage roles');
//               }
//             } else {
//               console.log(`Role not found for level ${level}`);
//             }
//           }
//         }
//       } else {
//         await userLevel.save();
//       }
//     } catch (error) {
//       console.error('Error handling message XP:', error);
//     }
//   });
// };