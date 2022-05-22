const mongoose = require ('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String
    }
}, 
{
    timestamps: true
})

module.exports = mongoose.model("Authors", authorSchema)