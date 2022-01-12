const express=require('express')
const PORT=8899
const app=express()
const cors=require('cors')
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())
app.use('/images',express.static('uploads'))
const userRoutes=require('./routes/userRoutes')
const productRoutes=require('./routes/productRoutes')
const connectDb=require('./Connection/connectDB')
app.set('view engine','ejs')
connectDb()
//User
app.use('/api/',userRoutes)
app.use('/api/',productRoutes)
//end

//Notfound
app.use((req,res,next)=>{
 res.status(404).send(
   {
     status:404,
     error:"not found"
   }
 ) 
})
app.listen(PORT,(err)=>{
    if(err) throw err
    console.log(`WORK ON PORT ${PORT}`)
})