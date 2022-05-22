const mongoose = require ('mongoose')

const bookSchema = new mongoose.Schema({
    book_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
        },
    title: {
        type: String,
        required: true,
        trim: true
        },
    description: {
        type: String,
        trim: true
    },
    summary: {
        type: String,
        trim: true
    },
    author: {
        type: String,
        required: true
        },
    genre: {
        type: Array,
        required: true
        },
    language: {
        type: String,
        required: true
    },
    images: {
        type: String,
        default: "https://dl.acm.org/templates/jsp/_ux3/_acm/images/default-cover-images/cover-default--book.jpeg"
    },
    page: {
        type: Number,
        required: true
    },
    isBestSeller:{
        type: Boolean,
        default: false
    },
    isPromoted:{
        type: Boolean,
        default: false
    }, 
    sellerUrl:{
        type: String,
        default: "https://www.amazon.com/"
    },
    rating: {
        type: Number,
        default: 0
    }, 
    numReviews:{
        type: Number,
        default: 0
    }
}, 
{
    timestamps: true // important ???
})

module.exports = mongoose.model("Books", bookSchema)