require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { Rcon } = require('rcon-client');
const { Tail } = require('tail');

const RCON_CONFIG = {
    host: 'localhost',
    port: 25575,
    password: process.env.RCON_PASSWORD
};

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands dynamically
const commandFiles = fs.readdirSync(path.join(__dirname, "commands"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle slash commands
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error("Command execution error:", error);
        await interaction.reply({ content: "⚠️ An error occurred while executing this command.", ephemeral: true });
    }
});

/**
 * DISCORD -> MINECRAFT
 */
client.on("messageCreate", async (message) => {
    //ignore bot message
    if (message.author.bot) return;
    if (message.channelId !== process.env.CHANNEL_ID) return;

    // send to RCON
    const content = message.content;
    const sanitizedContent = content.replace(/"/g, "'").replace(/\\/g, "\\\\");
    const author = message.author.username;

    const tellraw = `tellraw @a [{"text":"[Discord] ","color":"blue"},{"text":"${author}","color":"gold"},{"text":": ${sanitizedContent}","color":"white"}]`;

    try {
        const rcon = await Rcon.connect(RCON_CONFIG);
        await rcon.send(tellraw);
        await rcon.end();
    } catch (error) {
        console.error("RCON Failed:", error);
        await message.react('❌');
    }

})

/**
 * MINECRAFT -> DISCORD
 */

const tail = new Tail(process.env.LOG_FILE);

tail.on("line", (data) => {
    console.log(data);

    const chatRegex = /\[.*] \[.*]: <(.*?)> (.*)/;
    const match = data.match(chatRegex);
    if (match) {
        const username = match[1];
        const message = match[2];
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        if (channel) {
            if (username === "Server") return;
            channel.send(`${username}: ${message}`);
        }
    }
});

tail.on("error", (error) => {
    console.error("Tail error:", error);
});
client.login(process.env.TOKEN);
