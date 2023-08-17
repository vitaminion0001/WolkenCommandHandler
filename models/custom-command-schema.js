const { Schema, models, model } = require('mongoose')

const customCommandSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
})

const name = 'custom-commands'

module.exports = models[name] || model(name, customCommandSchema)