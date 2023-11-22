module.exports = (command, usage) => {
    const { guildOnly, deferReply } = command.commandObject
    const { guild, message, interaction } = usage

    if (guildOnly === true && !guild) {
        const text = 'This command can only be ran within a server.'

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