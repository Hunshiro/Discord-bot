const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Economy = require('../../models/economy');
const Level = require('../../models/Level');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      const sortBy = interaction.options.getString('sort');

      if (!['level', 'balance'].includes(sortBy)) {
        await interaction.reply('Invalid option. Please specify either "level" or "balance".');
        return;
      }

      let usersData;
      if (sortBy === 'level') {
        usersData = await Level.find().sort({ level: -1 }).limit(10); // Sort by level in descending order
      } else {
        usersData = await Economy.find().sort({ money: -1 }).limit(10); // Sort by balance in descending order
      }

      if (!usersData || usersData.length === 0) {
        await interaction.reply('No user data found.');
        return;
      }

      const usernames = await getUsernames(interaction.guild, usersData);
      const leaderboardEmbed = generateLeaderboardEmbed(usersData, usernames, sortBy === 'level' ? 'Level' : 'Balance');

      await interaction.reply({ embeds: [leaderboardEmbed] });
    } catch (error) {
      console.error('Error with /leaderboard:', error);
      await interaction.reply('An error occurred while fetching the leaderboard.');
    }
  },

  name: 'leaderboard',
  description: 'Display the leaderboard for level or balance',
  options: [
    {
      name: 'sort',
      description: 'Specify whether to sort by level or balance',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Level', value: 'level' },
        { name: 'Balance', value: 'balance' }
      ]
    }
  ]
};

async function getUsernames(guild, users) {
    const usernames = [];
    for (const user of users) {
      try {
        const guildMember = await guild.members.fetch(user.userId);
        usernames.push(guildMember ? guildMember.user.username : 'Unknown User');
      } catch (error) {
        console.error(`Error fetching member for user ID ${user.userId}:`, error.message);
        usernames.push('Unknown User');
      }
    }
    return usernames;
  }

function generateLeaderboardEmbed(users, usernames, category) {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(`${category} Leaderboard`)
      .setDescription(`Top 10 users based on ${category}`)
      .setTimestamp();
  
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const username = usernames[i];
      let balance;
      if (category.toLowerCase() === 'balance') {
        balance = user.money; // Access balance from the user object (assuming it's stored as 'money')
      } else {
        balance = user[category.toLowerCase()]; // Access other categories similarly
      }
      embed.addFields({ name: `${i + 1}. ${username}`, value: `${category}: ${balance}`, inline: false });
    }
  
    return embed;
  }
