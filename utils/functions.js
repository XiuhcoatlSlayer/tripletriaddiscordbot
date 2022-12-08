const { Users, Cards, Decks } = require("../models/models");

async function checkUser(userID) { //checks to see if the user already started/has cards
    let data = await Users.findOne({ userID: userID });
    if (!data) {
        return false;
    } else {
        return true;
    };
};

function idToEmoji(number) { //converts the cards ID to numbers of emojis

    const emojiArray = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
    const numArray = String(number).split('').map(str => emojiArray[str]);

    return numArray.join('');

};

function starToEmoji(number) { //converts the cards star count to star emojis

    switch(number) {
        case 1: return "⭐";
        case 2: return "⭐⭐";
        case 3: return "⭐⭐⭐";
        case 4: return "⭐⭐⭐⭐";
        case 5: return "⭐⭐⭐⭐⭐";
    } ;

};

module.exports = {
    checkUser,
    idToEmoji,
    starToEmoji
}