const { Schema, models, model } = require('mongoose')

const requiredpermissionsSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    permissions: {
        type: [String],
        required: true,
    },
})

const name = 'required-permissions'

module.exports = models[name] || model(name, requiredpermissionsSchema)