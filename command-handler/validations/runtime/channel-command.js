module.exports = async (command, usage) => {
    const { commandName, instance } = command
    const { deferReply } = command.commandObject
    const { guild, channel, message, interaction } = usage

    if (!guild) {
        return true
    }

    const availableChannels = await instance.commandHandler.channelCommands.getAvailableChannels(guild.id, commandName)

    if (availableChannels.length && !availableChannels.includes(channel.id)) {
        const channelNames = availableChannels.map(c => `<#${c}> `)
        const reply = `This command can only be ran inside the following channel(s): ${channelNames}`

        if (deferReply) {
            if (deferReply === 'ephemeral') {
                if (message) message.reply({ content: reply, ephemeral: true })
                else if (interaction) interaction.editReply({ content: reply, ephemeral: true })
                return false
            } else {
                if (deferReply === true) {
                    if (message) message.reply(reply)
                    else if (interaction) interaction.editReply(reply)
                    return false
                }
            }
        } else {
            if (message) message.reply(reply)
            else if (interaction) interaction.reply(reply)
            return false
        }
    }

    return true
}