const mongoose = require(`mongoose`);

const userSchema = mongoose.Schema({
    userID: Number,

    cards: [Number]
});

module.exports = mongoose.model("Users", usersSchema);