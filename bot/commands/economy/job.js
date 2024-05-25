const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const Bal = require('../../models/economy');

// Define job earnings
const jobEarnings = {
  mining: 500,
  fishing: 300,
};

// Define job cooldowns (in minutes)
const jobCooldowns = {
  mining: 0,
  fishing: 0,
};

module.exports = {
  name: 'job',
  description: 'Do a job to earn money!',
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const jobType = interaction.options.getString('type');

      if (!jobType || !jobEarnings[jobType]) {
        interaction.editReply('Invalid job type!');
        return;
      }

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await Bal.findOne(query);

      if (!user) {
        // Create a new document for the user if it doesn't exist
        user = new Bal({
          ...query,
          lastDaily: new Date(),
          money: 0,
          bank: 0,
        });
      }

      const currentTime = new Date();
      const lastJobTime = user.lastJobTime ? user.lastJobTime.getTime() : 0;
      const cooldown = jobCooldowns[jobType] * 60 * 1000; // Convert minutes to milliseconds

      if (currentTime - lastJobTime < cooldown) {
        const remainingTime = Math.ceil((cooldown - (currentTime - lastJobTime)) / 60000);
        interaction.editReply(`You can't do this job yet. Please wait ${remainingTime} minutes.`);
        return;
      }

      // Update user's balance and last job time
      user.money += jobEarnings[jobType];
      user.lastJobTime = currentTime;
      await user.save();

      // Create animated embeds for fishing and mining
      const embed = new EmbedBuilder()
        .setTitle(`${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Job`)
        .setColor('#00ff00');

      

      let animationFrames = [];
      if (jobType === 'mining') {
        animationFrames = ['⛏️', '⛏️⛏️', '⛏️⛏️⛏️', '⛏️⛏️⛏️💰', '⛏️⛏️⛏️', '⛏️⛏️', '⛏️'];
      } else if (jobType === 'fishing') {
        animationFrames = ['🎣', '🎣🐟', '🎣🐟🎣', '🎣🐟🎣💰', '🎣🐟🎣', '🎣🐟', '🎣'];
      }

      for (let i = 0; i < animationFrames.length; i++) {
        embed.setDescription(`Performing ${jobType} job... ${animationFrames[i]}`);
        await interaction.editReply({ embeds: [embed] });
        // Adjust timing as needed
      }

      // Reset the description back to the original
      embed.setDescription(`Successfully earned ${jobEarnings[jobType]} Noirs !`);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error with /job: ${error}`);
      interaction.editReply('An error occurred while processing your request. Please try again later.');
    }
  },
  options: [
    {
      name: 'type',
      description: 'Type of job',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Mining', value: 'mining' },
        { name: 'Fishing', value: 'fishing' },
      ],
    },
  ],
};
