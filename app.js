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
// const ejsLayout =require('express-ejs-layouts')

const path = require('path')
const riderSchema = require('./riderSchema')

// const {post} = require('./riderSchema')


const app = express()

const mongodb ="mongodb+srv://delivery:A123456s@door.mlbv9l0.mongodb.net/DoorMan"
// 'mongodb://localhost:27017/DoorMan'
// process.env.MONGODB

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
// app.use (ejsLayout)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())





app.get('/', (req, res)=>{
    res.render('landing',{
        title: 'DoorMan- Home page'
    })
})
app.get('/login', (req, res)=>{
    res.render('login',{
        title: 'DoorMan-customer registration'
    })
})

app.get('/registration', (req, res)=>{
    res.render('registration',{
        title: 'DoorMan-customer registration'
    })
})
app.get('/ridersReg', (req, res)=>{
    res.render('ridersReg',{
        title: 'DoorMan-rider registration'
    })
})
app.get('/bike', (req, res)=>{
    res.render('bike', {
        title: 'DoorMan-bike registration'
    })
})
app.get('/ridersLogin', (req,res)=>{
    res.render('ridersLogin',{
        title: 'DoorMan-rider login'
    })
})

app.get('/rider-page', (req,res)=>{
    res.render('rider-page', {
        title: "DoorMan-rider page"
    })
})

app.get('/customer-page', protectRoute, async(req,res)=>{
    const user = req.user.user.number
        const customers_details = await customerSchema.find()
       const customer_name = await  customerSchema.findOne({Number:user})
        res.render('customer-page' ,{
            posts:customers_details, 
            name: customer_name.firstname,
            title: 'DoorMan-customer page'
        })
        })

// Registering a new user
app.post('/registration', async(req,res)=>{
    // console.log(req.body)
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
app.post('/ridersReg', async(req,res)=>{
    // console.log(req.body)
    const regInfo = req.body
    const password = regInfo.password
    const firstname = req.body.firstName
    console.log(req.body.firstname)
   
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(req.body)
    
    registerRider()
    async function registerRider(){
        try{
            const user = new riderSchema({
                firstname: regInfo.firstName,
                lastname: regInfo.lastName,
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
            res.redirect('/bike')
        }
        catch(err){
            console.log(err)
            res.redirect('/ridersReg')
        }
    }
})


//registering the rider's bike
// app.post('/bike', upload.array('multi-files', 3), async (req, res, next)=>{
app.post('/bike', upload.single('receipt'),  async(req, res, next)=>{
    console.log(req.body)

    const result = await cloudinary.uploader.upload((req. file.path))
    const bikeInfo = req.body
    console.log(result)
   
    bike()
    async function bike(){

        try{
        const bike =new riderSchema({
             owner: bikeInfo.owner,
             make: bikeInfo.make,
             regNumber: bikeInfo.regNumber,
             engNumber: bikeInfo.engNumber,
             chasis: bikeInfo.chasis,
             color: bikeInfo.color,
             receipt: bikeInfo.receipt,
            
        })
        await riderSchema.findOneAndUpdate(
            {
              Number:req.body.Number 
            },
            {
                owner: bikeInfo.owner,
                make: bikeInfo.make,
                regNumber: bikeInfo.regNumber,
                engNumber: bikeInfo.engNumber,
                chasis: bikeInfo.chasis,
                color: bikeInfo.color,
                receipt: result.url,
                licence: result.url,
                insurance: result.url
                
            }
        


        )
        res.render('bike')
        }catch(err){
            console.log(err)
            res.render('bike')
         }

    }
})
 

app.post('/lic', upload.single('licence'),  async(req, res, next)=>{
    const bikeLic = req.body
    const result = await cloudinary.uploader.upload((req. file.path))
    .then(()=>{
    console.log(result)
   

    
    lic()
    async function lic(){

        try{
        const bike =new riderSchema({
             licence: bikeLic.licence
            
        })
        await riderSchema.findOneAndUpdate(
            {
              Number:req.body.Number 
            },
            {
                licence: result.url
                // insurance: result.url
                
            }
        )
        res.render('bike')
        }catch(err){
            console.log(err)
            res.render('bike')
         }

    }
}).catch((err)=>{
    console.log("lic error" + err)
})
})

app.post('/insu', upload.single('insurance'),  async(req, res, next)=>{
    const bikeInsu = req.body
    const result = await cloudinary.uploader.upload((req. file.path))
    .then(()=>{
        console.log(result)
       
    
        insu()
        async function insu(){
    
            try{
            const bike =new riderSchema({
                 insurance: bikeInsu.insurance
                
            })
            await riderSchema.findOneAndUpdate(
                {
                  Number:req.body.Number 
                },
                {
                    insurance: result.url
                    // insurance: result.url
                    
                }
            )
            res.render('bike')
            }catch(err){
                console.log(err)
                res.render('bike')
             }
    
        }
   
    }) .catch((err)=>{
        console.log(err)
})
})




//posting the login route

app.post ('/login',(req,res)=>{
    const loginInfo =req.body
    const Number = loginInfo.Number
    const password =loginInfo.password
    const firstName =loginInfo.firstName
    console.log(Number)
    console.log(password)
   
const customer = customerSchema.findOne({Number})
    .then((customer)=>{
        console.log('error m:'+ customer)
        // console.log("database password: ", user.password)

        bcrypt.compare(password, customer.password, (err, data)=>{
            console.log("database password: ", customer.password, customer.Number)

            if(data){
                 console.log('error t:'+data)
                 const payload ={
                    user:{
                        number:customer.Number
                        
                    }
                }
                const token = jwt.sign(payload, 'DoorMan', {
                    expiresIn: '3600s'
                })
                res.cookie('token', token, {
                    httpOnly:true
                })
                res.redirect( '/customer-page')
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

function protectRoute(req, res, next){
    const token = req.cookies.token
    try{
        const user = jwt.verify(token, 'DoorMan')

        req.user = user
        // console.log(req.user)
        next()
    }
    catch(err){
        res.clearCookie('token')
        return res.redirect('')
    }
}

//login a rider
app.post ('/ridersLogin',(req,res)=>{
    const loginInfo =req.body
    const Number = loginInfo.Number
    const password =loginInfo.password
    const firstName =loginInfo.firstName
    
    console.log(Number)
    
   const user = riderSchema.findOne({Number})
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
                res.redirect('/rider-page' )
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









const port =process.env.PORT||7000
app.listen(port, ()=>{
    console.log(`server start at ${port}`)
})