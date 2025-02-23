
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports=(req,res,next)=>{
    const {authorization} = req.headers
    //authorization--- Bearer hfhrfuerhferhf
    if (!authorization) {
        return res.status(401).json({error:'You Must Be Logged in'})
    }
    const tokan = authorization.replace("Bearer ","")
    jwt.verify(tokan,JWT_SECRET,(err,payload)=>{
        if (err) {
            return res.status(401).json({error:'You Must Be Logged in'})
        }
        const {_id}= payload
        User.findById(_id).then(userdata=>{
                req.user = userdata
                next()
        })
        
    })
}