const mongoose = require(`mongoose`);

const cardsSchema = mongoose.Schema({
    name : String,
    id : Number,
    top: Number,
    right: Number,
    left: Number,
    bottom: Number,
    type: String,
    drop : [String]
});

module.exports = mongoose.model("Cards", cardsSchema);