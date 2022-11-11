const mongoose = require("mongoose");
const cardData = require("../data/cards");
const Cards = require("../models/cards");
const config = require("../config");

mongoose.connect(config.mongoPath).then(async () => {
	console.log("Connected to the database!");

	const cards = cardData.map((data) => { // map cards into [new Cards.save()]
		return new Cards({
			name: data.name,
			id: data.id,
			top: data.top,
			right: data.right,
			left: data.left,
			bottom: data.bottom,
			type: data.type,
			drop: data.drop
		}).save();


	})
	await Promise.all(cards) // resolve all promises before continuing

	console.log("Finished~");
	process.exit();
});