module.exports = {
    name: `command`,
    async execute(interaction, client) {
        //Find command in Collection
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        //Attempt to run command
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `There was an error while executing this command!`, ephemeral: true });
        }
    }
};