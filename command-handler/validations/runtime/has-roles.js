const requiredRoles = require('../../../models/required-roles-schema')

module.exports = async (command, usage) => {
    const { guild, member, message, interaction } = usage
    const { deferReply } = command.commandObject

    if (!member) {
        return true
    }

    const _id = `${guild.id}-${command.commandName}`
    const document = await requiredRoles.findById({ _id })

    if (document) {
        let hasRole = false

        for (const roleId of document.roles) {
            if (member.roles.cache.has(roleId)) {
                hasRole = true
                break
            }
        }

        if (hasRole) {
            return true
        }

        const reply = {
            content: `You need one of these roles: ${document.roles.map((roleId => `<@&${roleId}>`))}`,
            allowedMentions: {
                roles: []
            }
        }
        const ephemeralReply = {
            content: `You need one of these roles: ${document.roles.map((roleId => `<@&${roleId}>`))}`,
            allowedMentions: {
                roles: []
            },
            ephemeral: true
        }

        if (deferReply) {
            if (deferReply === 'ephemeral') {
                if (message) message.reply(ephemeralReply)
                else if (interaction) interaction.editReply(ephemeralReply)
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