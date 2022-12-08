const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);
const { Users, Decks } = require("../models/models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("decks")
        .setDescription("Manage your Triple Triad card decks.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("View one or all of your decks.")
                .addStringOption(option =>
                    option
                        .setName('decktoview')
                        .setDescription('The deck you want to view.')
                        .setRequired(true)
                        .addChoices(
                            { name: '1', value: '1' },
                            { name: '2', value: '2' },
                            { name: '3', value: '3' },
                            { name: '4', value: '4' },
                            { name: '5', value: '5' },
                            { name: 'all', value: 'all' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("Delete one or all of your decks.")
                .addStringOption(option =>
                    option
                        .setName('decktodelete')
                        .setDescription('The deck you want to delete.')
                        .setRequired(true)
                        .addChoices(
                            { name: '1', value: '1' },
                            { name: '2', value: '2' },
                            { name: '3', value: '3' },
                            { name: '4', value: '4' },
                            { name: '5', value: '5' },
                            { name: 'all', value: 'all' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Create a deck in an empty deck slot.")
                .addIntegerOption(option =>
                    option
                        .setName("slot")
                        .setDescription("Which deck slot you want to create a deck in.")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(5))
                .addIntegerOption(option =>
                    option
                        .setName("card1")
                        .setDescription("The ID of the card you want in the first slot.")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(353))
                .addIntegerOption(option =>
                    option
                        .setName("card2")
                        .setDescription("The ID of the card you want in the second slot.")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(353))
                .addIntegerOption(option =>
                    option
                        .setName("card3")
                        .setDescription("The ID of the card you want in the third slot.")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(353))
                .addIntegerOption(option =>
                    option
                        .setName("card4")
                        .setDescription("The ID of the card you want in the fourth slot.")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(353))
                .addIntegerOption(option =>
                    option
                        .setName("card5")
                        .setDescription("The ID of the card you want in the fifth slot.")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(353)    
                    )
        ),

    async execute(interaction, client) {
        let checkUser = await client.functions.checkUser(interaction.user.id);
        if (!checkUser) {
            return interaction.reply({ content: `You don't have any cards... run \`/start\` to start collecting!`, ephemeral: true });
        };

        Users.findOne({
            userID: interaction.user.id
        }, async (err, user) => {
            const obtainedCards = user.cards;
            const currentDecks = user.decks;

            if (interaction.options.getSubcommand() === "create") { //they want to create a new deck

                const slot = interaction.options.getInteger("slot");
                if (currentDecks[slot] === [] || currentDecks[slot] === null || currentDecks[slot] === undefined) { //checks to see if the slot is open

                    const card1ID = interaction.options.getInteger("card1");
                    const card2ID = interaction.options.getInteger("card2");
                    const card3ID = interaction.options.getInteger("card3");
                    const card4ID = interaction.options.getInteger("card4");
                    const card5ID = interaction.options.getInteger("card5");

                    const card1 = obtainedCards.filter(obj => { return obj.id === card1ID});
                    const card2 = obtainedCards.filter(obj => { return obj.id === card2ID});
                    const card3 = obtainedCards.filter(obj => { return obj.id === card3ID});
                    const card4 = obtainedCards.filter(obj => { return obj.id === card4ID});
                    const card5 = obtainedCards.filter(obj => { return obj.id === card5ID});

                    if (!card1[0]|| !card2[0] || !card3[0] || !card4[0] || !card5[0]) { //if any card is not currently obtained by the user
                        return interaction.reply({ content: `You do not own one or more of these cards! Please make sure you have obtained a card you're trying to use in your deck!`, ephemeral: true });
                    };

                    /*
                    Rules for creating Decks in Triple Triad:
                    1. Deck must have 5 cards.
                    2. Deck cannot have any duplicate cards.
                    3. Deck can only have 2 cards that are higher than 3 stars (4/5).
                    4. Deck can only have 1 card that is a 5 star.
                    */

                    //rule 2:
                    const cardArray = [card1ID, card2ID, card3ID, card4ID, card5ID];
                    const cardSet = new Set(cardArray);
                    if (cardSet.size !== cardArray.length) { //Sets must be unique, so if this is true then there are not 5 unique cards in the deck
                        return interaction.reply({ content: `You cannot have duplicate cards in a deck!`, ephemeral :true });
                    };

                    //rule 3:
                    const cardStarsArray = [card1.stars, card2.stars, card3.stars, card4.stars, card5.stars];
                    const fourStarsCheck = cardStarsArray.filter(star => star > 3);
                    if (fourStarsCheck.length > 2) {
                        return interaction.reply({ content: `You can only have two cards of rarity 4 or higher in a deck!`, ephemeral: true });
                    };

                    //rule 4:
                    const fiveStarsCheck = cardStarsArray.filter(star => star > 4);
                    if (fiveStarsCheck.length > 1) {
                        return interaction.reply({ content: `You can only have one five star card in your deck!`, ephemeral: true });
                    };

                    const newDeck = new Decks({
                        userID: interaction.user.id,
                        userSlot: slot,
                        card1: card1,
                        card2: card2,
                        card3: card3,
                        card4: card4,
                        card5: card5
                    });
                    newDeck.save().catch(err => console.log(err));

                    let user = await Users.findOne({ userID: interaction.user.id });
                    user.decks[slot] = newDeck;
                    await user.updateOne(user);

                    return interaction.reply({ content: `New Deck created! You can view it with \`/decks view ${slot}\`!`, ephemeral :true });


                } else { //this runs if the slot is already taken by a deck
                    return interaction.reply({ content: `You already have a deck in this slot! Please choose another slot, or delete this deck first.`, ephemeral: true });
                };


            }; //end of create action

            if (!currentDecks[1] && !currentDecks[2] && !currentDecks[3] && !currentDecks[4] && !currentDecks[5]) { // if user has no decks they can't view or delete

                return interaction.reply({ content: `You haven't made any decks... run \`/decks create\` to create one!`, ephemeral: true });

            };

            if (interaction.options.getSubcommand() === "view") { //they want to see one or all of their decks

                const deckToView = interaction.options.getString("decktoview");

                if (deckToView === "all") { //they want to view all of their decks at once

                    let deckString1 = "";
                    let deckString2 = "";
                    let deckString3 = "";
                    let deckString4 = "";
                    let deckString5 = "";

                    if(currentDecks[1] && currentDecks[1] !== null) {
                        const deck1cards = [ currentDecks[1].card1[0], currentDecks[1].card2[0], currentDecks[1].card3[0], currentDecks[1].card4[0], currentDecks[1].card5[0]];
                        deck1cards.forEach(card => {
                            deckString1 = deckString1 + `${client.functions.idToEmoji(card.id)} - ${client.functions.starToEmoji(card.stars)} ${card.name}\n`
                        });
                    };

                    if(currentDecks[2] && currentDecks[2] !== null) {
                        const deck2cards = [ currentDecks[2].card1[0], currentDecks[2].card2[0], currentDecks[2].card3[0], currentDecks[2].card4[0], currentDecks[2].card5[0]];
                        deck2cards.forEach(card => {
                            deckString2 = deckString2 + `${client.functions.idToEmoji(card.id)} - ${client.functions.starToEmoji(card.stars)} ${card.name}\n`
                        });
                    };
                    if(currentDecks[3] && currentDecks[3] !== null) {
                        const deck3cards = [ currentDecks[3].card1[0], currentDecks[3].card2[0], currentDecks[3].card3[0], currentDecks[3].card4[0], currentDecks[3].card5[0]];
                        deck3cards.forEach(card => {
                            deckString3 = deckString3 + `${client.functions.idToEmoji(card.id)} - ${client.functions.starToEmoji(card.stars)} ${card.name}\n`
                        });
                    };
                    if(currentDecks[4] && currentDecks[4] !== null) {
                        const deck4cards = [ currentDecks[4].card1[0], currentDecks[4].card2[0], currentDecks[4].card3[0], currentDecks[4].card4[0], currentDecks[4].card5[0]];
                        deck4cards.forEach(card => {
                            deckString4 = deckString4 + `${client.functions.idToEmoji(card.id)} - ${client.functions.starToEmoji(card.stars)} ${card.name}\n`
                        });
                    };
                    if(currentDecks[5] && currentDecks[5] !== null) {
                        const deck5cards = [ currentDecks[5].card1[0], currentDecks[5].card2[0], currentDecks[5].card3[0], currentDecks[5].card4[0], currentDecks[5].card5[0]];
                        deck5cards.forEach(card => {
                            deckString5 = deckString5 + `${client.functions.idToEmoji(card.id)} - ${client.functions.starToEmoji(card.stars)} ${card.name}\n`
                        });
                    };

                    const deckEmbed = new EmbedBuilder() //embed showing all of their current decks
                        .setTitle(`${interaction.user.username}'s Current Decks`)
                        .addFields(
                            { name: `Deck 1`, value: deckString1, inline: false },
                            { name: `Deck 2`, value: deckString2 || "None", inline: false },
                            { name: `Deck 3`, value: deckString3 || "None", inline: false },
                            { name: `Deck 4`, value: deckString4 || "None", inline: false },
                            { name: `Deck 5`, value: deckString5 || "None", inline: false }
                        )
                        .setTimestamp()
                        .setFooter({text: 'To see information on a specific card you own, run /collection [id]'});

                    return interaction.reply({ embeds: [deckEmbed] });

                } else { //they want to see a specific deck

                    let deckString = "";

                    if(currentDecks[deckToView] && currentDecks[deckToView] !== null) {
                        const deckcards = [ currentDecks[deckToView].card1[0], currentDecks[deckToView].card2[0], currentDecks[deckToView].card3[0], currentDecks[deckToView].card4[0], currentDecks[deckToView].card5[0]];
                        deckcards.forEach(card => {
                            deckString = deckString + `${client.functions.idToEmoji(card.id)} - ${client.functions.starToEmoji(card.stars)} ${card.name}\n`
                        });
                    } else { //they don't have a deck in the slot they provided
                        return interaction.reply({ content: `You don't have a deck in slot ${deckToView}.`, ephemeral: true });
                    };

                    const deckEmbed = new EmbedBuilder() //embed showing the specific deck
                    .setTitle(`${interaction.user.username}'s Deck: ${deckToView}`)
                    .addFields(
                        { name: `Deck ${deckToView}`, value: deckString, inline: false }
                    )
                    .setTimestamp()
                    .setFooter({text: 'To see information on a specific card you own, run /collection [id]'});

                return interaction.reply({ embeds: [deckEmbed] });

                };

                
            }; //end of view action


            if (interaction.options.getSubcommand() === "delete") { //they want to delete one or all of their decks

                const deckToDelete = interaction.options.getString("decktodelete");

                if (deckToDelete === "all") { //they want to delete all of their decks at once

                    user.decks = []; //set all decks to empty
                    await user.updateOne(user);

                    await Decks.deleteMany({ 'userID': interaction.user.id });

                    return interaction.reply({ content: `You have deleted all of your decks. To make a new one, use \`/decks create\`!`, ephemeral: true });
                    
                } else { //they want to delete a specific deck

                    user.decks[deckToDelete] = null; //set the deck they specified to empty
                    await user.updateOne(user);

                    await Decks.deleteOne({ 'userID': interaction.user.id, 'userSlot': deckToDelete});

                    return interaction.reply({ content: `You have deleted deck ${deckToDelete}.`, ephemeral: true});

                };

            }; //end of delete action

        });

    }
}