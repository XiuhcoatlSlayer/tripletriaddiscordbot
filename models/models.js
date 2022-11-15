const mongoose = require(`mongoose`);

const cardsSchema = new mongoose.Schema({
    name: String,
    id: Number,
    top: Number,
    right: Number,
    left: Number,
    bottom: Number,
    type: String,
    drop: [String]
});

const decksSchema = new mongoose.Schema({
    name: String,
    card1: [cardsSchema],
    card2: [cardsSchema],
    card3: [cardsSchema],
    card4: [cardsSchema],
    card5: [cardsSchema]
});

const userSchema = new mongoose.Schema({
    userID: Number,

    cards: [cardsSchema],
    decks: [decksSchema]
});

const Users = mongoose.model("Users", userSchema);
const Cards = mongoose.model("Cards", cardsSchema);
const Decks = mongoose.model("Decks", decksSchema);

module.exports = {
    Users,
    Cards,
    Decks
};