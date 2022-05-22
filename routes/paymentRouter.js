const router = require('express').Router()
const paymentCtrl = require('../controllers/paymentCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.route('/payment')
    .get(auth, paymentCtrl.getPayments)
    .post(auth, paymentCtrl.createPayment)
    
    router.route('/payment/:id')
    .delete(auth, paymentCtrl.cancelPayment)


module.exports = router
