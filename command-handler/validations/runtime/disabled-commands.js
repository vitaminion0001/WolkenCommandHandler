module.exports = async (command, usage) => {
    const { commandName, instance } = command
    const { deferReply } = command.commandObject
    const { guild, message, interaction } = usage

    if (!guild) {
        return true
    }

    if (instance.commandHandler.disabledCommands.isDisabled(guild.id, commandName)) {
        const text = 'This command has been disabled.'
        if (deferReply) {
            if (deferReply === 'ephemeral') {
                if (message) message.reply({ content: text, ephemeral: true })
                else if (interaction) interaction.editReply({ content: text, ephemeral: true })
                return false
            } else {
                if (deferReply === true) {
                    if (message) message.reply(text)
                    else if (interaction) interaction.editReply(text)
                    return false
                }
            }
        } else {
            if (message) message.reply(text)
            else if (interaction) interaction.reply(text)
            return false
        }
        return false
    }

    return true
}