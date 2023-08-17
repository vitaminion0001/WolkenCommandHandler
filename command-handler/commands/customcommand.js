const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    description: 'creates a custom command.',
    longDescription: 'Creates a simple custom command that will return what you set as response.',

    minArgs: 3,
    syntaxError: 'Correct syntax: {PREFIX}customcommand {ARGS}',
    expectedArgs: '<command name> <description> <response>',

    type: 'SLASH',
    guildOnly: true,
    testOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    callback: async ({ instance, args, guild }) => {
        const [commandName, description, response] = args

        await instance.commandHandler.customCommands.create(guild.id, commandName, description, response)

        return {
            content: `Custom command "${commandName}" has been created.`
        }
    }
}