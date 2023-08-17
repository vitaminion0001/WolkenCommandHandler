const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    description: "Sets the prefix for this server.",
    longDescription: 'Sets the prefix the bot will listen to in this server.',
    
    minArgs: 1,
    syntaxError: 'Correct syntax: {PREFIX}prefix {ARGS}',
    expectedArgs: '<prefix>',

    type: 'BOTH',
    testOnly: true,
    guildOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    callback: async ({ instance, guild, text: prefix }) => {
        instance.commandHandler.prefixHandler.set(guild.id, prefix)

        return {
            content: `Set "${prefix}" as the command prefix for this server.`
        }
    }
}