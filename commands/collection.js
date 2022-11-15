const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);
const { Users, Cards } = require("../models/models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("collection")
        .setDescription("Check which Triple Triad cards you have collected."),

    async execute(interaction, client) {

        let checkUser = await client.functions.checkUser(interaction.user.id);
        if (!checkUser) {
            return interaction.reply({content: `You don't have any cards... run \`/start\` to start collecting!`, ephemeral: true});
        };

        Users.findOne({
            userID: interaction.user.id
        },(err, user) => {

            const obtainedCards = user.cards.sort((a, b) => a.id - b.id);

            let cardString = ""
            obtainedCards.forEach(card => {
                cardString = cardString + `${card.id} - ${card.name}\n`
            });

            const cardEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s Triple Triad Card Collection`)
                .addFields(
                    { name: `Cards Obtained`, value: cardString}
                )
                .setTimestamp()       

            interaction.reply({embeds: [cardEmbed]});

        });

    }
}