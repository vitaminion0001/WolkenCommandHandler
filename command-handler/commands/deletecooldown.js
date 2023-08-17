const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')
const cooldownSchema = require('../../models/cooldown-schema')
const { cooldownTypes } = require('../../util/Cooldowns')

module.exports = {
    description: 'Deletes a cooldown.',
    longDescription: 'Deletes a cooldown for a user from the mentioned command.',

    type: 'SLASH',
    testOnly: true,
    guildOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: 'member',
            description: 'The member to delete the cooldown for.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'command',
            description: 'The command from which to delete the cooldown for the user.',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],

    autocomplete: (_, command) => {
        return [...command.instance.commandHandler.commands.keys()]
    },

    callback: async ({ instance, guild, interaction }) => {
        const member = interaction.options.getUser('member')
        const commandName = interaction.options.getString('command')
        const command = instance.commandHandler.commands.get(commandName)
        const guildId = guild.id
        const { cooldowns } = command.commandObject
        if (cooldowns) {
            let cooldownType

            for (const type of cooldownTypes) {
                if (cooldowns[type]) {
                    cooldownType = type
                    break
                }
            }
            const isPerUser = cooldownType === cooldownTypes[0]
            const isPerUserPerGuild = cooldownType === cooldownTypes[1]
            const isPerGuild = cooldownType === cooldownTypes[2]
            const isGlobal = cooldownType === cooldownTypes[3]

            let cooldownKey

            if ((isPerUserPerGuild || isPerGuild) && !guildId) {
                return { 
                    content: `Invalid cooldown type "${cooldownType}" used outside of a guild.`
                }
            }
    
            if (isPerUser) {
                cooldownKey = `${member.id}-command_${commandName}`
            }
    
            if (isPerUserPerGuild) {
                cooldownKey = `${member.id}-${guild.id}-command_${commandName}`
            }
    
            if (isPerGuild) {
                cooldownKey = `${guild.id}`
            }
    
            if (isGlobal) {
                cooldownKey = `command_${commandName}`
            }

            instance._cooldowns._cooldowns.delete(cooldownKey)
            await cooldownSchema.deleteOne({ _id: cooldownKey })

            // const cooldownUsage = {
            //     cooldownType,
            //     userId: member.id,
            //     actionId: `command_${commandName}`,
            //     guildId: guild?.id,
            //     duration: cooldowns[cooldownType],
            //     errorMessage: cooldowns.errorMessage,
            // }
            
            
        }

        return { 
            content: `The cooldown for <@!${member.id}> from command "${commandName}" has been deleted.` 
        }
    }
}