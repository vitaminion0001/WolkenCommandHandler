const { Schema, model, models } = require('mongoose')

const cooldownSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true,
    }
})

const name = 'cooldowns'

module.exports = models[name] || model(name, cooldownSchema)