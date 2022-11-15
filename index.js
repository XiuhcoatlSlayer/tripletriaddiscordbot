const { Client, Collection, GatewayIntentBits } = require(`discord.js`);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages], allowedMentions: { parse: [] } });
const fs = require(`fs`);
client.config = require(`./config`);
client.functions = require(`./utils/functions.js`);

//Connecting to Mongo Server
const mongoose = require(`mongoose`);
mongoose.connect(client.config.mongoPath).then(() => {
    console.log("Connected to the database!");
});

//Loading commands into the client
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
};

//Loading Interactions into the client
client.interactions = new Collection();
const interactionFiles = fs.readdirSync('./interactions').filter(ifile => ifile.endsWith('.js'));
for (const ifile of interactionFiles) {
    const inter = require(`./interactions/${ifile}`);
    client.interactions.set(inter.name, inter);
};

//Client Event Handler
const eventFiles = fs.readdirSync(`./events`).filter(efile => efile.endsWith(`.js`));
for (const efile of eventFiles) {
    const event = require(`./events/${efile}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    };
};

//Login
client.login(client.config.discordToken);