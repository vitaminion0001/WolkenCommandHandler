const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
    description: 'Sets a command to be restricted to a specific channel.',
    longDescription: 'Use this command to restrict the command usage to a specific channel.',

    type: 'SLASH',
    testOnly: true,
    guildOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: 'command',
            description: 'The command to restrict to a specific channel.',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        },
        {
            name: 'channel',
            description: 'The channel to restrict the command too.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    autocomplete: (_, command) => {
        return [...command.instance.commandHandler.commands.keys()]
    },

    callback: async ({ instance, guild, interaction }) => {
        const commandName = interaction.options.getString('command')
        const channel = interaction.options.getChannel('channel')

        const command = instance.commandHandler.commands.get(commandName.toLowerCase())

        if (!command) {
            return {
                content: `the command "${commandName}" does not exist.`
            }
        }

        const { channelCommands } = instance.commandHandler

        let availableChannels = []
        const canRun = (await channelCommands.getAvailableChannels(guild.id, commandName)).includes(channel.id)

        if (canRun) {
            availableChannels = await channelCommands.remove(guild.id, commandName, channel.id)
        } else {
            availableChannels = await channelCommands.add(guild.id, commandName, channel.id)
        }

        if (availableChannels.length) {
            const channelNames = availableChannels.map(c => `<#${c}> `)
            return {
                content: `The command "${commandName}" can now only be ran inside the following channel(s): ${channelNames}`
            }
        }

        return {
            content: `The command "${commandName}" can now be ran inside of any channel.`
        }
    }
}