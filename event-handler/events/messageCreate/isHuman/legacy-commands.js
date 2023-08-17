module.exports = async (message, instance) => {
    const { guild, content } = message
    const { commandHandler } = instance
    const { prefixHandler, commands, customCommands } = commandHandler

    const prefix = prefixHandler.get(guild?.id)
    if (!content.startsWith(prefix)) {
        return
    }

    const args = content.split(/\s+/)
    const commandName = args.shift().substring(prefix.length)

    const command = commands.get(commandName, message)

    if (!command) {
        customCommands.run(commandName, message)
        return
    }

    const { reply, deferReply } = command.commandObject

    if (deferReply) {
        message.channel.sendTyping()
    }

    const response = await commandHandler.runCommand(command, args, message)
    if (!response) {
        return
    }

    if (reply) {
        message.reply(response).catch(() => {console.log('error')})
    } else {
        message.channel.send(response).catch(() => {console.log('error')})
    }
}