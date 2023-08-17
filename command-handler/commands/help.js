const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    description: 'Shows general help, or specific command help if available.',
    longDescription: 'Sends all the commands or a specific command with the description about the command.',

    type: 'BOTH',
    testOnly: true,
    guildOnly: true,
    reply: true,

    minArgs: 0,
    maxArgs: 1,
    correctSyntax: 'Correct syntax: {PREFIX}help {ARGS}',
    expectedArgs: '<command>',

    options: [
        {
            name: 'command',
            description: 'The command to show the help for.',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        },
    ],

    autocomplete: (_, command) => {
        return [...command.instance.commandHandler.commands.keys()]
    },

    callback: async ({ instance, interaction, args }) => {
        console.log(args)
        if (args.length > 0) {
            const comName = args[0]
            const command = instance.commandHandler.commands.get(`${comName}`)

            if (!command) {
                return {
                    content: `I do not have a command named: ${comName}`
                }
            } else {
                if (!command.commandObject.longDescription) {
                    const helpEmbed = new EmbedBuilder()
                        .setTitle('Help')
                        .setColor('#87ceeb')
                        .setDescription(`Here is what i know about the **${comName}** command:\n${command.commandObject.description}`)
                        .setFooter({ text: 'Wolken CommandHandler' })
                        .setTimestamp()
                    return {
                        embeds: [helpEmbed]
                    }
                } else {
                    const helpEmbed = new EmbedBuilder()
                        .setTitle('Help')
                        .setColor('#87ceeb')
                        .setDescription(`Here is what i know about the **${comName}** command:\n${command.commandObject.longDescription}`)
                        .setFooter({ text: 'Wolken CommandHandler' })
                        .setTimestamp()
                    return {
                        embeds: [helpEmbed]
                    }
                }

            }
        } else {
            const commands = instance.commandHandler.commands.keys()

            let lines = []
    
            for (const com of commands) {
                const command = instance.commandHandler.commands.get(`${com}`)
                lines.push(`Name: **${command.commandName}** \nDescription: ${command.commandObject.description}\n`)
            }
    
            const segments = [lines.shift()]
            for(const line of lines){
                if(segments[segments.length-1].length + line.length > 3000){
                    segments.push(line)
                }else{
                    segments[segments.length-1] += "\n"+line
                }
            }
    
            const embeds = []
    
            for(const segment of segments) {
                const embed = new EmbedBuilder()
                embeds.push(embed.setDescription(segment).setColor(`#87ceeb`))
            }
        
            embeds[0].setAuthor({
                name: "Here are my commands."
            })
            embeds[0].setFooter({
                text: `Wolken CommandHandler`
            })
            embeds[0].setTimestamp()
    
            for(const embed of embeds) {
                return {
                    embeds: [embed]
                }
            }
        }
    }
}