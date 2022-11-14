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

const userSchema = new mongoose.Schema({
    userID: Number,

    cards: [cardsSchema]
});

const Users = mongoose.model("Users", userSchema);
const Cards = mongoose.model("Cards", cardsSchema);

module.exports = {
    Users,
    Cards
};