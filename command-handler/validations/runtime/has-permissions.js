const { PermissionFlagsBits } = require('discord.js')
const requiredPermissions = require('../../../models/required-permissions-schema')

const keys = Object.keys(PermissionFlagsBits)

module.exports = async (command, usage) => {
    const { permissions = [], deferReply } = command.commandObject
    const { guild, member, message, interaction } = usage

    if (!member) {
        return true
    }

    const document = await requiredPermissions.findById(`${guild.id}-${command.commandName}`)

    if (document) {
        for (const permission of document.permissions) {
            if (!permissions.includes(permission)) {
                permissions.push(permission)
            }
        }
    }

    if (permissions.length) {
        const missingPermissions = []

        for (const permission of permissions) {
            if (!member.permissions.has(permission)) {
                const permissionName = keys.find((key) => key === permission || PermissionFlagsBits[key] === permission)
                missingPermissions.push(permissionName)
            }
        }

        if (missingPermissions.length) {
            const text = `You are missing the following permission(s): "${missingPermissions.join('", "')}"`

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
    }

    return true
}