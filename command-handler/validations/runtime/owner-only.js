module.exports = (command, usage) => {
    const { instance, commandObject } = command
    const { botOwners } = instance
    const { ownerOnly, deferReply } = commandObject
    const { user } = usage

    if (ownerOnly === true && !botOwners.includes(user.id)) {
        const text = 'This command can only be ran by the bot owners.'

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
    }

    return true
}