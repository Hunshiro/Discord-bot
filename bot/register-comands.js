require('dotenv').config();
const {REST,Routes}= require('discord.js');

const commands = [
    {
        name: 'embed',
        description: "send an embed",
    }
];

const rest = new REST({version:'10'}).setToken(process.env.TOKEN_NEW);

(
    async () =>{
try {
    console.log("Started registering slash commands.");
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID)
        ,{body:commands}
    );
    console.log("Successfully registered application commands");

} catch (error) {
    console.error('Error while registering commands:', error);
    if (error.errors) {
        console.error('API errors:', error.errors);
    }
}
    }
)();
