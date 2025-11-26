const {SlashCommandBuilder} = require("discord.js");
const util = require("minecraft-server-util");
const {Events} = require("discord.js");

module.exports = {
    // configure slashCommandBuilder
    data: new SlashCommandBuilder()
    .setName("track_server")
        .setDescription("Set a server to poll every minute")
        .addStringOption((option) => option
            .setName("ip")
            .setDescription("IP of the server")
            .setRequired(true))
        .addStringOption(option => option
            .setName("port")
            .setDescription("port of the server")
            .setRequired(false)),

    // configure command execution

    async execute(interaction) {
        const ip = interaction.options.getString("ip");
        const port = interaction.options.getInteger("port") || 25565;

        try {
            const response = await util.status(ip, port);
            console.log(response);

            await interaction.messageCreate(`WIP command..`)

        } catch (error) {
            console.log(error.message);
            await interaction.reply(`WIP command..`);
        }
    }

}