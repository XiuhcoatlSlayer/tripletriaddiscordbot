const mongoose = require("mongoose");
const cardData = require("../data/cards");
const Cards = require("../models/cards");
const config = require("../config");

mongoose.connect(config.mongoPath, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Connected to the database!");

    cardData.forEach(async (data) => {

        let newCard = new Cards({
            name: data.name,
            id: data.id,
            top: data.top,
            right: data.right,
            left: data.left,
            bottom: data.bottom,
            type: data.type,
            drop: data.drop
        });

        await newCard.save().then(console.log("Card loaded!")).catch(err => console.log(err));

    });

    console.log("Finished~");
});