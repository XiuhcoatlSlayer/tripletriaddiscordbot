# Triple Triad Discord Bot

A Discord bot that allows you to play the card game Triple Triad (from the video game series Final Fantasy) inside of Discord. Collect cards, battle NPCs and other users, and collect TC (Triad Coins) to purchase card packs!

This bot specifically uses the cards from the 14th installment of the Final Fantasy Franchise - the critically acclaimed MMORPG FFXIV.

## Dependencies, Installation, and Updates

This bot requires Discord.js version 14.6.0 and Mongoose (MongoDB) version 6.7.0.

To start your bot, simply rename examples.config.js to config.js and replace the default values with your bots information. Make sure that you run the scripts to initialize the bot before starting.
```javascript
npm run register:cards
npm run deploy:commands global
node index.js
```
If you only want to push commands to one server instead of globally, replace `global` with `guild`, this will be the server you specify in config.js.

To update your cards database in the event of newly released cards, download the new cards file and replace your old one, then run `npm run register:cards reset` to drop your card collection and replace it (so you don't have any duplicated cards).

## FAQs

```javascript
coming soon!
```

## Questions and Support

If you need support with installation, setup, usage, have any questions, or simply want to join a community where Triple Triad lovers can use the bot and connect, feel free to join the Discord server: https://discord.gg/f7AAWMeBhT

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)