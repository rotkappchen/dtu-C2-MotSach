const { route } = require('express/lib/application')
const userCtrl = require('../controllers/userCtrl')
const Router = require('express').Router()
const auth = require ('../middleware/auth')
const authAdmin = require ('../middleware/authAdmin')


Router.post('/register', userCtrl.register)

//Router.post('/activation', userCtrl.activateEmail)

Router.post('/login', userCtrl.login)

Router.post('/refresh_token', userCtrl.getAccessToken)

Router.post('/reset', auth, userCtrl.resetPassword)

Router.get('/info', auth, userCtrl.getUserInfo)

Router.get('/all_info', auth, authAdmin, userCtrl.getUsersAllInfo)

Router.get('/logout', userCtrl.logout)

Router.patch('/update', auth, userCtrl.updateUser)

Router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUsersRole)

Router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)

Router.post('/facebook_login', userCtrl.facebookLogin)
module.exports = Router