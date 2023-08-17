const chalk = require('chalk')
const getAllFiles = require('./get-all-files')

class Featurehandler {
    constructor(instance, featuresDir, client) {

        this.readFiles(instance,featuresDir, client)
    }

    async readFiles(instance, featuresDir, client) {
        const files = getAllFiles(featuresDir)
        console.info('Loading features...')

        let i =0
        for (const file of files) {
            const func = require(file)
            if (func instanceof Function) {
                await func(instance, client)
            }
            ++i
        }
        console.info(chalk.green`Loaded ${i} features`)
    }
}

module.exports = Featurehandler