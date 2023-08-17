module.exports = async (command) => {
    const { commandName, commandObject } = command

    await new Promise(resolve => setTimeout(resolve, 500))
    console.info('Loaded command: ', commandName)
}