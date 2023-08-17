const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    description: `Deletes a slash command.`,
    longDescription: `You can delete a slashcommand with this command if the normal way of deleting doesn't work.`,

    type: 'SLASH',
    ownerOnly: true,
    testOnly: true,
    //delete: true,

    options: [
        {
            name: 'name',
            description: 'the name of the command to delete.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    callback: async ({ interaction, client, guild }) => {
        const name = interaction.options.getString('name')

        await guild.commands.delete('1124439203942510593')
    }
}