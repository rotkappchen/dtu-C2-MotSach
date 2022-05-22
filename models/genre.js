const mongoose = require ('mongoose')

const genreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }


}, 
{
    timestamps: true
})

module.exports = mongoose.model("Genres", genreSchema)