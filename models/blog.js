const mongoose = require ('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
        },
    content: {
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
    author_name: {
        type: String,
        default:"",
        required: true
    },
    images: {
        type: String,
        default: "https://dl.acm.org/templates/jsp/_ux3/_acm/images/default-cover-images/cover-default--book.jpeg"
    },
    word: {
        type: Number
    },
    rating: {
        type: Number,
        default: 0
    }, 
    numReviews:{
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    }
}, 
{
    timestamps: true // important ???
})

module.exports = mongoose.model("Blogs", blogSchema)