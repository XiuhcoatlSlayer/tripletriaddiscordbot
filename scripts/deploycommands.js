const { REST, Routes } = require("discord.js");
const config = require("../config");
const fs = require(`fs`);

//Creating commands json array
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
};

//Pushing array to Discord
const rest = new REST({ version: '9'}).setToken(config.discordToken);

if (process.argv[2] === "guild") { //Only pushes commands to the testing guild/support server specified in config.

	rest.put(Routes.applicationGuildCommands(config.clientID, config.serverID), {body: commands}).then(() => {
		console.log("Successfully registered application commands to the support server.");
	}).catch(console.error);

} else if (process.argv[2] === "global") { //Globally pushes commands to all guilds.

	rest.put(Routes.applicationCommands(config.clientID), {body: commands}).then(() => {
		console.log("Successfully globally registered application commands.");
	}).catch(console.error);

};