const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')
const requiredPermissions = require('../../models/required-permissions-schema')

const clearAllPermissions = 'Clear all permissions'

module.exports = {
    description: 'Sets required permissions',
    longDescription: 'Set Required permissions for the selected command.',

    type: 'SLASH',
    guildOnly: true,
    testOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: 'command',
            description: 'the command to set the permissions for',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: 'permission',
            description: 'the permission to set for the command.',
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true,
        }
    ],

    autocomplete: (_, command, arg) => {
        if (arg === 'command') {
            return [...command.instance.commandHandler.commands.keys()]
        } else if (arg === 'permission') {
            return [clearAllPermissions, ...Object.keys(PermissionFlagsBits)]
        }
    },

    callback: async ({ instance, guild, args }) => {
        const [commandName, permission] = args

        const command = instance.commandHandler.commands.get(commandName)
        if (!command) {
            return { 
                content: `The command "${commandName}" does not exist.`
            }
        }

        const _id = `${guild.id}-${command.commandName}`

        if (!permission) {
            const document = await requiredPermissions.findById(_id)

            const permissions = document && document.permissions?.length ? document.permissions.join(', ') : 'none'

            return { 
                content: `Here are the required permissions for "${commandName}": ${permissions}`
            }
        }

        if (permission === clearAllPermissions) {
            await requiredPermissions.deleteOne({ _id })

            return { 
                content: `The command "${commandName}" no longer requires any permissions.`
            }
        }

        const alreadyExists = await requiredPermissions.findOne({
            _id,
            permissions:{
                $in: [permission]
            }
        })

        if (alreadyExists) {
            await requiredPermissions.findOneAndUpdate(
                {
                    _id,
                },
                {
                    _id,
                    $pull: {
                        permissions: permission
                    }
                }
            )

            return {
                content: `The command "${commandName}" no longer requires the permission "${permission}"`
            }
        }

        await requiredPermissions.findOneAndUpdate(
            {
                _id,
            },
            {
                _id,
                $addToSet: {
                    permissions: permission
                }
            },
            {
                upsert: true,
            }
        )

        return {
            content: `The command "${commandName}" now requires the permission "${permission}"`
        }
    }
}