const { Client, Interaction, EmbedBuilder } = require('discord.js');
const Bal = require('../../models/economy');

const dailyAmount = 1000;
const maxStreakDays = 5;
const animationInterval = 1000;

module.exports = {
  name: 'daily',
  description: 'Collect your dailies!',
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

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await Bal.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily ? user.lastDaily.toDateString() : null;
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'You have already collected your dailies today. Come back tomorrow!'
          );
          return;
        }

        if (lastDailyDate && isNextDay(user.lastDaily)) {
          // If streak is broken, reset it
          user.streak = 0;
        }

        user.lastDaily = new Date();
        user.streak = (user.streak || 0) + 1;

        if (user.streak > maxStreakDays) {
          user.streak = maxStreakDays;
        }
      } else {
        user = new Bal({
          ...query,
          lastDaily: new Date(),
          streak: 1,
        });
      }

      user.money += dailyAmount;
      await user.save();

      // Generate streak representation in embed
      const embed = new EmbedBuilder()
        .setTitle('Daily Reward')
        .setDescription(`You have claimed your daily reward!`)
        .addFields({ name: 'Streak', value: generateAnimatedStreakString(user.streak),inline:false },
        { name: 'Balance', value:`Your new balance is ${user.money}`,inline:false })
        .setColor('#ffcc00');

      interaction.editReply({ embeds: [embed] });

       // Simulate filling animation
       const frames = [];
       for (let i = 0; i <= user.streak; i++) {
         frames.push(generateAnimatedStreakString(i));
       }
 
       let frameIndex = 0;
       const interval = setInterval(() => {
         if (frameIndex >= frames.length) {
           clearInterval(interval);
           return;
         }
 
         embed.fields[0].value = frames[frameIndex++];
         reply.edit({ embeds: [embed] });
       }, animationInterval);
    } catch (error) {
      console.log(`Error with /daily: ${error}`);
    }
  },
};

// Helper function to check if the current date is the next day
function isNextDay(lastDate) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() );
  return lastDate <= yesterday;
}

// Helper function to generate streak representation
function generateAnimatedStreakString(streak) {
  let streakString = '';
  for (let i = 0; i < maxStreakDays; i++) {
    if (i < streak) {
      streakString += '⚫'; // Filled circle
    } else {
      streakString += '⚪'; // Empty circle
    }
  }
  return streakString;
}
