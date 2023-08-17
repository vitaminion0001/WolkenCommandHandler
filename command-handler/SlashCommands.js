const { ApplicationCommandOptionType } = require('discord.js')
const chalk = require('chalk')

class SlashCommands {
    constructor(client) {
        this._client = client
    }

    async getCommands(guildId) {
        let commands

        if (guildId) {
            const guild = await this._client.guilds.fetch(guildId)
            commands = guild.commands

        } else {
            commands = this._client.application.commands
        }

        await commands.fetch()

        return commands
    }

    areOptionsDifferent(options, excistingOptions) {
        for (let a = 0; a < options.length; ++a) {
            const option = options[a]
            const excisting = excistingOptions[a]

            if (option.name !== excisting.name || option.type !== excisting.type || option.description !== excisting.description) {
                return true
            }
        }

        return false
    }

    async create(name, description, options, guildId) {
        const commands = await this.getCommands(guildId)

        const excistingCommand = commands.cache.find((cmd) => cmd.name === name)

        if (excistingCommand) {
            const { description: excistingDescription, options: excistingOptions } = excistingCommand

            if (description !== excistingDescription || options.length !== excistingOptions.length || this.areOptionsDifferent(options, excistingOptions)) {
                console.info(chalk.yellow`Updating the command "${name}"`)

                await commands.edit(excistingCommand.id, {
                    description,
                    options,
                })
            }
            
            return
        }

        await commands.create({
            name,
            description,
            options
        })
        console.info(chalk.green`Created the command "${name}"`)
    }

    async delete(commandName, guildId) {
        const commands = await this.getCommands(guildId)
        const excistingCommand = commands.cache.find((cmd) => cmd.name === commandName)

        if (!excistingCommand) {
            return
        }
        console.info(chalk.red`Deleted command: "${commandName}"`)

        await excistingCommand.delete()
    }

    createOptions({ expectedArgs = '', minArgs = 0 }) {
        const options = []

        if (expectedArgs) {
            const split = expectedArgs.substring(1, expectedArgs.length - 1)
                .split(/[>\]] [<\[]/)

            for (let a = 0; a < split.length; ++a) {
                const arg = split[a]

                options.push({
                    name: arg.toLowerCase().replace(/\s+/g, '-'),
                    description: arg,
                    type: ApplicationCommandOptionType.String,
                    required: a < minArgs
                })
            }
        }

        return options
    }
}

module.exports = SlashCommands