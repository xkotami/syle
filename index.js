require('dotenv').config();

const PREFIX ='/';
const MC_SERVER_HOST = '26.232.101.108'
const MC_SERVER_PORT = 25565
/**
 * Import discord.js and mc server util to interact with discord and MC
 */
const {Client, GatewayIntentBits} = require('discord.js');
const util = require('minecraft-server-util')

/**
 * Instantiate the client (bot) and enable server, messages and messageContent permissions so the bot can
 * read and respond
 */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`)
})

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === 'mcstatus') {
        try {
            const response = await util.status(MC_SERVER_HOST, MC_SERVER_PORT);
            message.channel.send(`🎮 **Minecraft Server Status** 🎮
            - **Server:** ${MC_SERVER_HOST}
            - **Online Players:** ${response.players.online}/${response.players.max}
            - **Version:** ${response.version.name}
            - **MOTD:** ${response.motd.clean}`);
        } catch(error) {
            message.channel.send('❌ The Minecraft server is offline or unreachable.')
        }
    }
})

client.login(process.env.TOKEN);

