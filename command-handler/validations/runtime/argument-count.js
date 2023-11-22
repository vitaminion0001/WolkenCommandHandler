module.exports = (command, usage, prefix) => {
    const { 
        minArgs = 0, 
        maxArgs = -1, 
        correctSyntax, 
        expectedArgs = '',
        deferReply
    } = command.commandObject
    const { length } = usage.args

    if (length < minArgs || (length > maxArgs && maxArgs !== -1)) {
        const text = correctSyntax.replace('{PREFIX}', prefix).replace('{ARGS}', expectedArgs)

        const { message, interaction } = usage

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