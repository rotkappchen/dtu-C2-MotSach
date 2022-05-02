const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String, 
        required: [true, "Please enter your email!"],
        unique: true,
        trim: true
    },
    password: {
        type: String, 
        required: [true, "Please enter your password!"],
        },
    role: {
        type: Number, 
        default: 0 // 0= reader, 1=editor
    },
    avatar: {
        type: String, 
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR10UW6Dz8ZOryv8lM2gbAnUbc4zVeiDIWQOw&usqp=CAU"
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)