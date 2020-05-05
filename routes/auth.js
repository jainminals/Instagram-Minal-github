const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
var bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

// router.get('/protected',requireLogin,(req,res) =>{
//     res.send('Hello User')
// })

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

module.exports = router
