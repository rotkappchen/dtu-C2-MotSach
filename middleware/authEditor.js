const Users = require('../models/user')

const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.findOne({_id: req.user.id})

        if(user.role == 2 || user.role == 1)
        next() 
        else return res.status(500).json({msg: "Editor resources access denied."})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin