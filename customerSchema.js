const mongoose = require('mongoose')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser =require('cookie-parser')
const mongodb ="mongodb+srv://delivery:A123456s@door.mlbv9l0.mongodb.net/DoorMan"
// 'mongodb://localhost:27017/DoorMan'
// process.env.MONGODB

mongoose.connect(mongodb)

const customerSchema = new mongoose.Schema({
    firstname:{
        type: String,
        
    },

    lastname:{
        type: String,
        
        
    },

    email:{
        type: String,
       
    },

    Number:{
        type: String
    },
    password:{
        type: String,
       
    },
    conPassword:{
        type: String,
        
    },
    country:{
        type: String,
        
    }
})

module.exports =mongoose.model('customerProfile', customerSchema)