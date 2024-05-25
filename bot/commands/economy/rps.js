const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChatInputCommandInteraction } = require('discord.js');

const choices = [{
    name: 'rock',
    emoji: '🪨',
    beats: 'scissors'
}, {
    name: 'paper',
    emoji: '🧻',
    beats: 'rock'
}, {
    name: 'scissors',
    emoji: '✂️',
    beats: 'paper'
}];

module.exports = {
    /**
     * 
     * @param {object} param0 
     * @param {ChatInputCommandInteraction} param0.interaction
     */
    callback: async ({ interaction }) => {
        try {
            const targetUser = interaction.options.get('target-user');
            
            if (interaction.user.id === targetUser.id) {
                interaction.reply({
                    content: 'You can\'t play with yourself!',
                    ephemeral: true,
                });
                return;
            }
            if (targetUser.bot) {
                interaction.reply({
                    content: 'You can\'t play with a bot!',
                    ephemeral: true,
                });
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle('Rock Paper Scissors')
                .setDescription(`It's currently ${targetUser}'s turn!`)
                .setColor('YELLOW')
                .setTimestamp();

            const buttons = choices.map((choice) => {
                return new ButtonBuilder()
                    .setCustomId(choice.name)
                    .setLabel(choice.name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(choice.emoji)
            });

            const row = new ActionRowBuilder().addComponents(buttons);
             await interaction.reply({
                content: `${targetUser}, you have been challenged to a game of rock paper scissors by ${interaction.user}. To start playing, click one of the buttons below.`,
                embeds: [embed],
                components: [row],
            });
        } catch (error) {
            console.error(`Error in rps command: ${error}`);
        }
    },
   
        name: 'rps',
        description: 'Play rock, paper, scissors with the bot!',
        options: [
            {
                name: 'target-user',
                description: 'The user you want to play with.',
                type: ApplicationCommandOptionType.User,
                required: true
            },
        ],
  
};
