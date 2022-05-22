const Users= require('../models/user')
const bcrypt = require ('bcrypt')
const jwt= require ('jsonwebtoken')
//const sendMail = require('./sendMail')
const {CLIENT_URL}= process.env
const fetch = require('node-fetch')
const user = require('../models/user')


const userCtrl ={
    register: async (req, res)=>{
        try {
            const {name, email, password} = req.body

            if(!name || !email || !password)
            return res.status(400).json({msg: "Please fill in all the field"})

            if(!validateEmail(email))
            return res.status(400).json({msg: "Invalid email."})

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg:"This email already exists."})
            if(password.length<6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})
            const passwordHash = await bcrypt.hash(password, 12)
            
            const newUser = {
                name, email, password: passwordHash
            }
            const activation_token = createActivationToken(newUser)
            console.log(activation_token)

            const check = await Users.findOne({email})
            if(check) return json({msg: "This email already exists."})

            const newUser0 = new Users({
                name, email, password
            })

            await newUser0.save()


            // const url =`${CLIENT_URL}/user/activate/${activation_token}`
            // sendMail(email, url)
            // res.json({msg:"Register Successful! Please activate your email to start."})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    // activateEmail: async (req, res) => {
    //     try {
    //         const {activation_token}=req.body
    //         const user= jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)
            
    //         const {name, email, password}=user
            
    //         const check = await Users.findOne({email})
    //         if(check) return res.status(400).json({msg: "This email already exists."})

    //         const newUser = new Users({
    //             name, email, password
    //         })

    //         await newUser.save()
            
    //     } catch (err) {
    //         return res.status(500).jason({msg: err.message})
    //     }
    // },
    login: async(req, res) =>{
        try {
            const {email, password}=req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "Incorrect email or password."})    

            //const isMatch = await bcrypt.compare(password, user.password)
            //if(!isMatch) return res.status(400).json({msg:"Incorrect email or password."})
            if(password!=user.password) return res.status(400).json({msg:"Incorrect email or password."})

            const refresh_token= createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refresh_token,{
                httpOnly: true, 
                path: '/api/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })
            
            res.json({msg: "Login success!"})

          } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            //console.log(rf_token)
            if (!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if (err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: user.id})
                res.json({access_token})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    forgotPassword: async (req, res) =>{
        try {
            
        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body
            //console.log(password)
            //const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({_id: req.user.id}, {
                password: password
            })

            res.json({msg: "Password successfully changed!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    getUserInfo: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')

            res.json(user)
            
        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    getUsersAllInfo: async (req, res) => {
        try {
            const users = await Users.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/api/refresh_token'})
            return res.json({msg: "Logged out."})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    updateUser: async (req, res) => {
        try {
            const {name, avatar} = req.body
            await Users.findOneAndUpdate({_id: req.user.id}, {
                name, avatar
            })

            res.json({msg: "Update Success!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const {role} = req.body

            await Users.findOneAndUpdate({_id: req.params.id}, {
                role
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    facebookLogin: async (req, res) => {
        try {

            const {accessToken, userID} = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
            
            const data = await fetch(URL).then(res => res.json()).then(res => {return res})

            const {email, name, picture} = data

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({email})

            if(user){

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/api/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newUser.save()
                
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/api/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addBookList: async (req, res) => {
        try {
            const {favBook} = req.body
            // var added = false
            // added= Users.find({_id: req.user.id}, {
            //     $elemMatch: {favBook: favBook}
            // })
            // if (added) return res.status(400).json({msg:"This book is already added."})
            // else
            await Users.findOneAndUpdate({_id: req.user.id}, {
                $push: {favBook: favBook}
            })

            res.json({msg: "Book added"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removeBookList: async (req, res) => {
        try {
            const {favBook} = req.body
            await Users.findOneAndUpdate({_id: req.user.id}, {
                $pull: {favBook: favBook}
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserLevel: async (req, res) => {
        try {
            const {exp, level} = req.body

            await Users.findOneAndUpdate({_id: req.params.id}, {
                exp, level
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

const createActivationToken=(payload)=>{
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m' })
}
const createAccessToken=(payload)=>{
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d' })
}
const createRefreshToken=(payload)=>{
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d' })


}

module.exports= userCtrl