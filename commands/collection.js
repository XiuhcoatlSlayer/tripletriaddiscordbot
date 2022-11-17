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
        .setDescription("Check which Triple Triad cards you have collected.")
        .addIntegerOption(option =>
            option
                .setName("id")
                .setDescription("The ID of the card you want more information on.")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(353)),

    async execute(interaction, client) {
        let checkUser = await client.functions.checkUser(interaction.user.id);
        if (!checkUser) {
            return interaction.reply({ content: `You don't have any cards... run \`/start\` to start collecting!`, ephemeral: true });
        };

        Users.findOne({
            userID: interaction.user.id
        }, (err, user) => {
            const obtainedCards = user.cards.sort((a, b) => a.id - b.id);

            const id = interaction.options.getInteger("id");

            if (id) { //if user wants to see information about a specific card
                const card = obtainedCards.filter(obj => { return obj.id === id});
                if (!card[0]) {
                    return interaction.reply({content: `You don't seem to have that card... are you sure you typed the ID right?`, ephemeral: true});
                } else {
                    
                    let cardType = "";
                    if (card[0].type === "") {
                        cardType = "None"
                    } else {
                        cardType = card[0].type;
                    };

                    const infoString = `ID: ${idToEmoji(card[0].id)} - ${card[0].name} - Star Ranking: ${starToEmoji(card[0].stars)}\nType - ${cardType}\n\nCard Face:\n🟦 ${idToEmoji(card[0].top)} 🟦\n${idToEmoji(card[0].left)} 🟦 ${idToEmoji(card[0].right)}\n🟦 ${idToEmoji(card[0].bottom)} 🟦`
                    return interaction.reply({content: `${infoString}`});

                }
            };

            let cardString = ""
            obtainedCards.forEach(card => {
                cardString = cardString + `${idToEmoji(card.id)} - ${starToEmoji(card.stars)} ${card.name}\n`
            });

            const cardEmbed = new EmbedBuilder() //embed showing all of their cards at once. 
                .setTitle(`${interaction.user.username}'s Triple Triad Card Collection`)
                .setDescription(`Total Cards Obtained: ${obtainedCards.length}/353`)
                .addFields(
                    { name: `Cards Obtained`, value: cardString }
                )
                .setTimestamp()
                .setFooter({text: 'To see information on a specific card you own, run \`/collection [id]\`'});

            interaction.reply({ embeds: [cardEmbed] });
        });
    }
}