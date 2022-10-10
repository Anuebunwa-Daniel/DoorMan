require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const jwt = require('jsonwebtoken')
const cookieParser =require('cookie-parser')
const  bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const bodyParser  = require('body-parser')
const customerSchema =require('./customerSchema')
const {cloudinary} =require('./utis/cloudinary')
const multer = require('multer')
const upload = require('./utis/multer')

const path = require('path')
// const alert = require('alert')
const riderSchema = require('./riderSchema')
const { receiveMessageOnPort, resourceLimits } = require('worker_threads')
// const {post} = require('./riderSchema')


const app = express()

const mongodb = 'mongodb://localhost:27017/DoorMan'

mongoose.connect (mongodb)
.then(()=>{
    console.log('connected to the database')
})
.catch((err)=>{
    console.log('Database connection failed')
    console.log(err)
})

//middleware
app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))
app.use('/script', express.static('script'))
app.use(express.json());
// app.use(express.urlencoded({ extended: false }))
// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())





app.get('/', (req, res)=>{
    res.render('landing')
})
app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/registration', (req, res)=>{
    res.render('registration')
})
app.get('/index', (req, res)=>{
    res.render('index')
})
app.get('/ridersReg', (req, res)=>{
    res.render('ridersReg')
})
app.get('/bike', (req, res)=>{
    res.render('bike')
})
app.get('/layout', (req, res)=>{
    res.render('layout')
})


const userDetails = {
    firstname: '',
    lastname: '',
    Number: '',
    email: '',
    password: '',
    conPassword: '',
    country: ''
}




// Registering a new user
app.post('/registration', async(req,res)=>{
    console.log(req.body)
    const regInfo = req.body
    const password = regInfo.password
    const firstname = req.body.firstname
    console.log(req.body.firstname)
   
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(req.body)
    
    registerUser()
    async function registerUser(){
        try{
            const user = new customerSchema({
                firstname: regInfo.firstname,
                lastname: regInfo.lastname,
                Number: regInfo.Number,
                email: regInfo.email,
                password: hashedPassword,
                conPassword: regInfo.conpassword,
                country:regInfo.country
            })
            await user.save()
            const payload ={
                user:{
                    email:regInfo.email
                }
            }
            const token = await jwt.sign(payload, 'DoorMan',{
                expiresIn:'3600s'
            })
            res.cookie('token', token,{
                httpOnly: false
            })
            res.redirect('login')
            
        }
        catch(err){
            console.log(err)
            res.redirect('/registration')
        }
    }
})

//register a new rider





//posting the login route

app.post ('/login',(req,res)=>{
    const loginInfo =req.body
    const Number = loginInfo.Number
    const password =loginInfo.password
    const firstName =loginInfo.firstName
    console.log(Number)
    //  const hi= document.querySelector('no-icon').innerHTML
    //  hi = "hi: " + req.body.firstName
    //  console.log(hi)
    
   
   
const user = customerSchema.findOne({Number})
    .then((user)=>{
        console.log('error m:'+ user)
        // console.log("database password: ", user.password)

        bcrypt.compare(password, user.password, (err, data)=>{
            console.log("database password: ", user.password, user.Number)

            if(data){
                 console.log('error m:'+data)
                 const payload ={
                    user:{
                        number:user.Number
                        
                    }
                }
                const token = jwt.sign(payload, 'DoorMan', {
                    expiresIn: '3600s'
                })
                res.cookie('token', token, {
                    httpOnly:true
                })
                res.redirect('/layout')
            }
            
            else{
                console.log('error ty:'+err)
                res.redirect('/')
            
               
                
            }
        })
    }).catch((err)=>{
        console.log (err)
        res.redirect('/')
    })

})








const port = 7000
app.listen(port, ()=>{
    console.log(`server start at ${port}`)
})