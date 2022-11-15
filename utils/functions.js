const { Users, Cards, Decks } = require("../models/models");

async function checkUser(userID) { //checks to see if the user already started/has cards
    let data = await Users.findOne({ userID: userID });
    if (!data) {
        return false;
    } else {
        return true;
    };
};

module.exports = {
    checkUser
}