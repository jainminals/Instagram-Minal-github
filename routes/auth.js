const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
var bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {JWT_SECRET,SENDGRID_API ,EMAIL} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

// router.get('/protected',requireLogin,(req,res) =>{
//     res.send('Hello User')
// })


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.post('/signup',(req,res)=>{
   console.log(req.body.name) 
   const {name,email,password,pic} = req.body
   if(!name || !email || !password){
    return res.status(422).json({error:'Please add all fields'})
   }
   User.findOne({email:email})
   .then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:'User is already exist'})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword =>{
        const user = new User({
            email,
            password:hashedpassword,
            name,
            pic:pic
        })
        user.save()
        .then(user=>{
            transporter.sendMail({
                to:user.email,
                from: 'minaljain@credenceanalytics.com',
                subject:"Sign Up Successfully",
                html:"<h1>Welcome to instagram </h1>"

            })
            res.json({message:'User Successfull Added'})
        })
        .catch(err=>{
            console.log(err)
        })  
    })
    
   })
   .catch(err=>{
    console.log(err)
   })
   //res.json({message:'Successfully posted'})
})

router.post('/signin',(req,res) => {
    console.log(req.body.email) 
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:'Please add email or password'})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:'Invalid email or password'})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                //res.status(422).json({message:'Successfull Signed in'})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const{_id,name,email,followers,following,pic}= savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }else{
                return res.status(422).json({error:'Invalid email or password'})    
            }
        })
        .catch(err =>{
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"minaljain@credenceanalytics.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"check your email"})
            })

        })
    })
})


router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router
