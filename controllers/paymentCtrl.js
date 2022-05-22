const Payments = require('../models/payment')
const Users = require('../models/user')

const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPayment: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const {paymentID} = req.body;

            const {_id, name, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, paymentID
            })

            //console.log(newPayment)
            
            await newPayment.save()
            res.json({msg: "Payment Succes!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    cancelPayment: async (req, res) => {
        try {
            await Payments.findByIdAndDelete(req.params.id)
            res.json({msg: "Subscription ended."})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = paymentCtrl
