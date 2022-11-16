const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);
const { Users, Cards } = require("../models/models");

function idToEmoji(number) { //converts the cards ID to numbers of emojis

    const emojiArray = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
    const numArray = String(number).split('').map(str => emojiArray[str]);

    return numArray.join('');

};

function starToEmoji(number) { //converts the cards star count to star emojis

    switch(number) {
        case 1: return "⭐";
        case 2: return "⭐⭐";
        case 3: return "⭐⭐⭐";
        case 4: return "⭐⭐⭐⭐";
        case 5: return "⭐⭐⭐⭐⭐";
    } ;

};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("collection")
        .setDescription("Check which Triple Triad cards you have collected."),

    async execute(interaction, client) {
        let checkUser = await client.functions.checkUser(interaction.user.id);
        if (!checkUser) {
            return interaction.reply({ content: `You don't have any cards... run \`/start\` to start collecting!`, ephemeral: true });
        };

        Users.findOne({
            userID: interaction.user.id
        }, (err, user) => {
            const obtainedCards = user.cards.sort((a, b) => a.id - b.id);

            let cardString = ""
            obtainedCards.forEach(card => {
                cardString = cardString + `${idToEmoji(card.id)} - ${starToEmoji(card.stars)} ${card.name}\n`
            });

            const cardEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s Triple Triad Card Collection`)
                .addFields(
                    { name: `Cards Obtained`, value: cardString }
                )
                .setTimestamp()

            interaction.reply({ embeds: [cardEmbed] });
        });
    }
}