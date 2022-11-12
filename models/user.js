const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
    userID: Number,

    cards: [Number]
});

module.exports = mongoose.model("Users", usersSchema);