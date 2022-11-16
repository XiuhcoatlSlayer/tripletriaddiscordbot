const mongoose = require("mongoose");
const cardData = require("../data/cards");
const { Cards } = require("../models/models");
const config = require("../config");

mongoose.connect(config.mongoPath).then(async () => {
    console.log("Connected to the database!");

    if (process.argv[2] === "reset") { //Drops card collection so that we can create it again. Only do this if you're reloading the databse with a card update.
        await mongoose.connection.collections['cards'].drop().then(console.log("Collection dropped. Reinitializing..."));
    };

    const cards = cardData.map((data) => { // map cards into [new Cards.save()]
        return new Cards({
            name: data.name,
            id: data.id,
            stars: data.stars,
            top: data.top,
            right: data.right,
            left: data.left,
            bottom: data.bottom,
            type: data.type,
            drop: data.drop,
            price: data.price
        }).save();
    })
    await Promise.all(cards) // resolve all promises before continuing

    console.log("Finished~");
    process.exit();
});