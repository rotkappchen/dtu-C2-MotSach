const { route } = require('express/lib/application')
const userCtrl = require('../controllers/userCtrl')
const Router = require('express').Router()
const auth = require ('../middleware/auth')
const authAdmin = require ('../middleware/authAdmin')
const authEditor = require ('../middleware/authEditor')


Router.post('/register', userCtrl.register)

//Router.post('/activation', userCtrl.activateEmail)

Router.post('/login', userCtrl.login)

Router.post('/refresh_token', userCtrl.getAccessToken)

Router.post('/reset', auth, userCtrl.resetPassword)

Router.get('/info', auth, userCtrl.getUserInfo)

Router.get('/all_info', auth, authEditor, userCtrl.getUsersAllInfo)

Router.get('/logout', userCtrl.logout)

Router.patch('/update', auth, userCtrl.updateUser)

Router.patch('/add_booklist', auth, userCtrl.addBookList)

Router.patch('/remove_booklist', auth, userCtrl.removeBookList)

Router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUsersRole)

Router.patch('/update_level/:id', auth, userCtrl.updateUserLevel)


Router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)

Router.post('/facebook_login', userCtrl.facebookLogin)
module.exports = Router