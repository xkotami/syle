require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require('fs');
const path = require('path');
console.log("TOKEN:", process.env.TOKEN ? "Loaded ✅" : "Missing ❌");


const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands'));

// load commands into list
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commands...")
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
                body: commands
            }
        );
        console.log("Commands successfully registered.");
    } catch (error) {
        console.log(error);
    }
})();
