const {SlashCommandBuilder} = require("discord.js");
const util = require("minecraft-server-util");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("View the status of a minecraft server via its IP")
        .addStringOption(option => option
            .setName("ip")
            .setDescription("IP of the server")
            .setRequired(true)),

    async execute(interaction) {
        const ip = interaction.options.getString("ip");
        const port = 25565; // Default Minecraft port

        await interaction.deferReply(); // Prevents timeout while fetching data

        try {
            const response = await util.status(ip, port);
            const statusMessage = `**${ip}** is **online** 🟢\n- **Players**: ${response.players.online}/${response.players.max}\n- **Version**: ${response.version.name}`;
            await interaction.editReply(statusMessage);
        } catch (error) {
            await interaction.editReply(`❌ Could not reach **${ip}**. Server might be offline.`);
        }
    },
}

