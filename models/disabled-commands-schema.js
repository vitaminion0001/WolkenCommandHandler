const { Schema, models, model } = require('mongoose')

const disabledCommandSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
})

const name = 'disabled-commands'

module.exports = models[name] || model(name, disabledCommandSchema)