const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')
const requiredroles = require('../../models/required-roles-schema')


module.exports = {
    description: 'Sets required roles',
    longDescription: 'Sets the required roles for the selected command.',

    type: 'SLASH',
    guildOnly: true,
    testOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: 'command',
            description: 'the command to set the roles for',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: 'role',
            description: 'the role to set for the command.',
            type: ApplicationCommandOptionType.Role,
            required: false,
        }
    ],

    autocomplete: (_, command) => {
        return [...command.instance.commandHandler.commands.keys()]
    },

    callback: async ({ instance, guild, args }) => {
        const [commandName, role] = args

        const command = instance.commandHandler.commands.get(commandName)
        if (!command) {
            return `The command "${commandName}" does not exist.`
        }

        const _id = `${guild.id}-${command.commandName}`

        if (!role) {
            const document = await requiredroles.findById(_id)

            const roles = document && document.roles?.length ? document.roles.map((roleId) => `<@&${roleId}>`) : 'none'

            return {
                content: `Here are the required roles for "${commandName}": ${roles}`,
                allowedMentions: {
                    roles: []
                }
            }
        }

        const alreadyExists = await requiredroles.findOne({
            _id,
            roles:{
                $in: [role]
            }
        })

        if (alreadyExists) {
            const newData = await requiredroles.findOneAndUpdate(
                {
                    _id,
                },
                {
                    _id,
                    $pull: {
                        roles: role
                    }
                },
                {
                    new: true,
                }
            )
            if (!newData.roles.length) {
                await requiredroles.deleteOne({ _id })
            }

            return {
                content: `The command "${commandName}" no longer requires the role <@&${role}>`,
                allowedMentions: {
                    roles: []
                }
            }
        }

        await requiredroles.findOneAndUpdate(
            {
                _id,
            },
            {
                _id,
                $addToSet: {
                    roles: role
                }
            },
            {
                upsert: true,
            }
        )

        return {
            content: `The command "${commandName}" now requires the role <@&${role}>`,
            allowedMentions: {
                roles: []
            }
        }
    }
}