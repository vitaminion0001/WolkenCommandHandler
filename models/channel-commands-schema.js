const { Schema, model, models } = require('mongoose')

const channelCommandSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    channels: {
        type: [String],
        required: true,
    },
})

const name = 'channel-commands'
module.exports = models[name] || model(name, channelCommandSchema)