const { SlashCommandBuilder } = require(`discord.js`);
const { Users, Cards } = require("../models/models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Get your first Triple Triad deck!"),

    async execute(interaction, client) {
        let checkUser = await client.functions.checkUser(interaction.user.id);
        if (checkUser) {
            return interaction.reply({ content: `You already have your first deck! You can't get it again.`, ephemeral: true });
        };

        let firstDeck = await Cards.find({ 'drop': { $in: "First Deck" } });

        const newUser = new Users({
            userID: interaction.user.id,
            balance: 100,

            cards: firstDeck
        });

        newUser.save().catch(err => console.log(err));
        interaction.reply({ content: `You've received your first deck! Check your cards with \`/collection\` and build your deck with \`/deck\`!` });
    }
}