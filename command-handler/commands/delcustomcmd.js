const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    description: 'deletes a custom command.',
    longDescription: 'Deletes the custom command from the database.',

    minArgs: 1,
    syntaxError: 'Correct syntax: {PREFIX}delCustomCmd {ARGS}',
    expectedArgs: '<command name>',

    type: 'SLASH',
    guildOnly: true,
    testOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    callback: async ({ instance, text: commandName, guild }) => {
        await instance.commandHandler.customCommands.delete(guild.id, commandName)

        return {
            content: `Custom command "${commandName}" has been deleted.`
        }
    }
}