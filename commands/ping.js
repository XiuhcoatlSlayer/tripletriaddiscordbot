const { SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),

    async execute(interaction, client) {
        return interaction.reply("Pong!");
    }
}