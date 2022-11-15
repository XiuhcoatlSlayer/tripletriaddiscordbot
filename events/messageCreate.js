const { Users, Cards, Decks } = require("../models/models");

module.exports = {
    name: `messageCreate`,
    async execute(message, client) {

        if (client.user && message.mentions.has(client.user)) {
            let messageArray = message.content.split(/ +/); //regex to remove any additional spaces
            let mentions = messageArray[0].match(/^<@!?(\d+)>$/); //regex to match discord pings

            if(!mentions) return;

            if (mentions[1] === client.user.id) { //if the message starts with the bot mention
                if(!messageArray[1]) return;
                if (messageArray[1].toLowerCase() === 'eval') { //check if command is eval
                    if (client.config.ownerIDs.includes(message.author.id)) { //if the user running the command is an owner
                        let args = messageArray.slice(2);

                        function clean(text) {
                            if (typeof (text) === "string") {
                                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                            } else {
                                return text;
                            };
                        };

                        try {
                            let code = args.join(" ");
                            if (args.length == 0) return message.channel.send("You need to provide a code!");
                            if (args[0].toLowerCase() == "async") code = `(async function(){\n${code.slice(5)}\n})(client, message, args)`;
                            let evaled = await eval(code);
                            if (typeof evaled !== "string") {
                                evaled = require("util").inspect(evaled, {
                                    "depth": 0
                                });
                            };

                            message.channel.send(`\`\`\`js\n${clean(evaled).replace(client.config.discordToken, "????")}\n\`\`\``);

                        } catch (err) {
                            message.channel.send(`\`Error:\n\` \`\`\`js\n${clean(err)}\n\`\`\``);
                        };

                    };
                };
            };
        };
    }
};