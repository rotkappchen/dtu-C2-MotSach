const router = require('express').Router()
const bookCtrl = require ('../controllers/bookCtrl')
const auth = require('../middleware/auth')
const authAdmin = require ('../middleware/authAdmin')
const authEditor = require ('../middleware/authEditor')

router.route('/books')
    .get(bookCtrl.getBooks)
    .post(auth, authEditor, bookCtrl.createBook)

    router.route('/books/:id')
    .delete(auth, authEditor, bookCtrl.deleteBook)
    .put(auth, authEditor, bookCtrl.updateBook)
    .patch(bookCtrl.reviews)

module.exports = router