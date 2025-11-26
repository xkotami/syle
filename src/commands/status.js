const {SlashCommandBuilder} = require("discord.js");
const util = require("minecraft-server-util");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("View the status of a minecraft server via its IP")
        .addStringOption(option => option
            .setName("ip")
            .setDescription("IP of the server")
            .setRequired(true))
        .addIntegerOption(option => option
            .setName("port")
            .setDescription("Port of the server (default is 25565")
            .setRequired(false))
    ,

    async execute(interaction) {
        const ip = interaction.options.getString("ip");
        const port = interaction.options.getInteger("port") || 25565; // Default Minecraft port

        await interaction.deferReply(); // Prevents timeout while fetching data

        try {
            const response = await util.status(ip, port);
            console.log(response);
            const playerNames = response.players.sample.map(player => player.name).join(", ");
            const statusMessage = `**${ip}** is **online** 🟢\n- **Players**: ${playerNames}\n- **Version**: ${response.version.name} \n- **Ping**: ${response.roundTripLatency}\n- **MOTD**: ${response.motd.clean}`;
            await interaction.editReply(statusMessage);
        } catch (error) {
            await interaction.editReply(`❌ Could not reach **${ip}**. Server might be offline.`);
        }
    },
}

