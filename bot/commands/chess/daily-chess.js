const { Client, Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const { Chess } = require('chess.js');
const Economy = require('../../models/economy'); // Adjust path as needed

const fetchPuzzles = async () => {
  const puzzles = [];
  for (let i = 0; i < 5; i++) {
    try {
      const response = await axios.get('https://lichess.org/api/puzzle/daily');
      puzzles.push(response.data);
    } catch (error) {
      console.error(`Error fetching puzzle ${i + 1}:`, error);
    }
  }
  return puzzles;
};

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

    await interaction.deferReply();

    try {
      // Fetch multiple puzzles from the Lichess API
      const puzzles = await fetchPuzzles();
      if (puzzles.length === 0) {
        await interaction.editReply('Failed to fetch puzzles.');
        return;
      }

      // Randomly select a puzzle from the fetched puzzles
      const selectedPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      const puzzle = selectedPuzzle.puzzle;
      const game = selectedPuzzle.game;

      if (!puzzle || !game) {
        console.error('Puzzle or game data is missing');
        await interaction.editReply('Puzzle or game data is missing or incomplete.');
        return;
      }

      const moves = puzzle.solution; // Solution moves are already in SAN
      const chessGame = new Chess();
      chessGame.loadPgn(game.pgn);
      const fen = chessGame.fen();

      // Create an embed message to display the puzzle
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`Daily Puzzle: ${puzzle.id}`)
        .setURL(`https://lichess.org/training/${puzzle.id}`)
        .setDescription(`**Rating:** ${puzzle.rating}\nSolve the puzzle by clicking the 'Solve' button.`)
        .setImage(`https://fen2image.chessvision.ai/${encodeURIComponent(fen)}`);

      // Create the 'Solve' button
      const solveButton = new ButtonBuilder()
        .setCustomId('solve_puzzle')
        .setLabel('Solve')
        .setStyle(ButtonStyle.Primary);

      await interaction.editReply({ embeds: [embed], components: [{ type: 1, components: [solveButton] }] });

      const filter = (i) => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on('collect', async (i) => {
        if (i.customId === 'solve_puzzle') {
          await i.reply({
            content: 'Please type your move in the format: `<initial> <current position> <destination position>`.\nFor example: `k e4 e6`.',
            ephemeral: true
          });

          const messageFilter = (msg) => msg.author.id === interaction.user.id;
          const messageCollector = interaction.channel.createMessageCollector({ messageFilter, time: 60000 });

          messageCollector.on('collect', async (msg) => {
            const parts = msg.content.trim().split(' ');
            if (parts.length !== 3) {
              await msg.reply({
                content: 'Invalid format. Please use the format: `<initial> <current position> <destination position>`.',
                ephemeral: true
              });
              return;
            }

            const [initial, from, to] = parts;
            const moveSan = `${from}${to}`; // Format as "from to" for SAN validation

            try {
              const move = chessGame.move({
                from,
                to,
                promotion: initial === 'p' ? 'q' : undefined
              });

              if (move) {
                // Check if the user's move matches the puzzle solution
                const isCorrect = moves.some(solutionMove => {
                  return solutionMove === moveSan;
                });

                const content = isCorrect
                  ? `Correct! The move is ${moveSan}. You have been rewarded with 100 coins.`
                  : `Incorrect. The correct move was ${moves[0]}.`;

                const resultEmbed = new EmbedBuilder()
                  .setTitle('Puzzle Result')
                  .setDescription(content);

                await msg.reply({ embeds: [resultEmbed], ephemeral: true });

                if (isCorrect) {
                  // Reward the user with 100 coins
                  const userId = interaction.user.id;
                  const guildId = interaction.guild.id;
                  await Economy.findOneAndUpdate(
                    { userId, guildId },
                    { $inc: { money: 100 }, lastDaily: new Date() },
                    { upsert: true }
                  );
                }

                collector.stop();
                messageCollector.stop();
              } else {
                await msg.reply({
                  content: 'Invalid move according to the current position. Please try again.',
                  ephemeral: true
                });
              }
            } catch (error) {
              await msg.reply({
                content: 'An error occurred while processing your move. Please try again.',
                ephemeral: true
              });
            }
          });

          messageCollector.on('end', (collected) => {
            if (collected.size === 0) {
              i.followUp({
                content: 'Time is up! No move was made.',
                ephemeral: true,
              });
            }
          });
        }
      });

      collector.on('end', (collected) => {
        if (collected.size === 0) {
          interaction.editReply({
            content: 'Time is up! No action was taken.',
            components: [],
          });
        }
      });

    } catch (error) {
      console.error('Error fetching puzzle:', error);
      await interaction.editReply('Sorry, something went wrong while fetching the daily puzzle.');
    }
  },

  name: 'daily-puzzle',
  description: 'Fetches and displays a random daily chess puzzle from Lichess',
  options: [],
};
