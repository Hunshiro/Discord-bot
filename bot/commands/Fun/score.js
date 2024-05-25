const { Client, Interaction, ApplicationCommandOptionType, MessageAttachment, MessageEmbed } = require('discord.js');
const RapidAPI = require('rapidapi-connect');
const { createCanvas, loadImage } = require('canvas');

const rapid = new RapidAPI('your_rapidapi_project_name', 'your_rapidapi_key');

module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      const sport = interaction.options.getString('sport');
      if (!sport || (sport !== 'cricket' && sport !== 'football')) {
        await interaction.reply({
          content: 'Please provide a valid sport (cricket or football).',
          ephemeral: true,
        });
        return;
      }

      const liveScores = await fetchLiveScores(sport);
      if (!liveScores) {
        await interaction.reply({
          content: `No live scores available for ${sport}.`,
          ephemeral: true,
        });
        return;
      }

      const scorecardImageBuffer = await generateScorecard(liveScores);

      // Send scorecard image back to user
      const attachment = new MessageAttachment(scorecardImageBuffer, 'scorecard.png');
      const embed = new MessageEmbed()
        .setColor("#0E1000")
        .setTitle(`Live ${sport.charAt(0).toUpperCase() + sport.slice(1)} Scorecard`)
        .setImage('attachment://scorecard.png')
        .setFooter('Powered by RapidAPI');

      await interaction.reply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error('Error with /score:', error);
    }
  },

  name: 'score',
  description: 'Get live scorecard for cricket or football',
  options: [
    {
      name: 'sport',
      description: 'The sport for which you want to get the live scorecard (cricket or football)',
      type: ApplicationCommandOptionType.STRING,
      required: true,
      choices: [
        { name: 'Cricket', value: 'cricket' },
        { name: 'Football', value: 'football' },
      ],
    },
  ],
};

async function fetchLiveScores(sport) {
    try {
        const response = await rapid.call('YourSportsAPI', 'getLiveScores', {
            sport: sport // 'cricket' or 'football'
        });
        return response;
    } catch (error) {
        console.error('Error fetching live scores:', error);
        return null;
    }
}

async function generateScorecard(liveScores) {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    // Draw live scores on the canvas
    ctx.font = '20px Arial';
    ctx.fillText(`Team 1: ${liveScores.team1Score}`, 50, 50);
    ctx.fillText(`Team 2: ${liveScores.team2Score}`, 50, 100);

    return canvas.toBuffer(); // Convert canvas to image buffer
}
