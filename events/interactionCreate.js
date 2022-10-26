module.exports = {
    name: `interactionCreate`,
    async execute(interaction, client) {

         //Find interaction in Collection by customId
        let inter = client.interactions.get(interaction.customId);

        //If no customId then its a command
        if (!inter) {
            inter = client.interactions.find(i => i.name === "command");
        };

        //Attempt to run command
        try {
            await inter.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `There was an error while executing this command!`, ephemeral: true });
        }
    }
};