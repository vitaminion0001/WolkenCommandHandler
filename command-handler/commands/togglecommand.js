const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    description: 'Toggles on or off a command.',
    longDescription: 'Turns on or off the selected command in this server.',

    testOnly: true,
    guildOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    type: 'SLASH',

    options: [
        {
            name: 'command',
            description: 'The command to toggle on or off.',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
    ],

    autocomplete: (_, command) => {
        return [...command.instance.commandHandler.commands.keys()]
    },

    callback: async ({ instance, guild, text: commandName, interaction }) => {
        const { disabledCommands } = instance.commandHandler

        if (disabledCommands.isDisabled(guild.id, commandName)) {
            await disabledCommands.enable(guild.id, commandName)

            interaction.reply({ content: `Command "${commandName}" has been enabled.`})
        } else {
            await disabledCommands.disable(guild.id, commandName)

            interaction.reply({ content: `Command "${commandName}" has been disabled.`})
        }
    }
}