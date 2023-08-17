const chalk = require('chalk')
module.exports = async (command) => {
    const { commandName, commandObject } = command

    if (!commandObject.longDescription) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.warn(chalk.yellow`Loaded command:`, chalk.red`${commandName}`, chalk.yellow`Does not have a Long description, please add for the help command to function properly.`)
    }

}