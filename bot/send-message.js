require("dotenv").config();
const { Client, IntentsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const roles = [
    {
        id: '1178583410286022716',
        label: 'green'
    },
    {
        id: '1178583486853038080',
        label: 'orange'
    },
    {
        id: '1178583531962765352',
        label: 'yellow'
    },
];

client.on("ready", async (c) => {
    try {
        const channel = await client.channels.cache.get('1178350933353189379');
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.addComponents(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });

        await channel.send({
            content: "Claim or remove the custom role",
            components: [row],
        });
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);
