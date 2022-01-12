const jsonwebtoken=require('jsonwebtoken')
const jsonsecret="5sa5sa67s66s66sa6saww"
const main=require('../Sendmail/Sendmail')
const userModel=require('../db/userSchema.js');
const cartModel=require('../db/Products/cartSchema');
const orderModel=require('../db/Products/orderSchema');
const tokenModel=require('../db/TokenSchema');
const crypto =require('crypto')
const bcrypt = require('bcrypt');
const multer =require('multer')
const path=require('path')

const fs=require('fs')
const invoicegeneate=require('../controller/Invoicegenerate')
//getting all product 
const autenticateToken= async(req,res,next)=>{
    if(req!=undefined){
        var token=null
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token=( req.headers.authorization.split(' ')[1]);
        } else if (req.query && req.query.token) {
            token=( req.query.token);
        }
        //console.log(req.header)
        if(token==null){
            res.json({"err":1,"msg":"Token not match"})
        }
        else {
            await jsonwebtoken.verify(token,jsonsecret,(err,data)=>{
                if(err){
                    res.send("Token expired")
                }
                else {
                    next();
                }
            })
        }
    }
    else{
        next()
    }
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
        //console.log(path.join(__dirname, './uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
        //console.log(file)
    }
});
const multi_upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('myfile', 1)
const registerUser= async (req, res , next)=>{
    console.log(req.body)
    let firstname=req.body.firstname;
    let lastname=req.body.lastname;
    let email=req.body.email;
    let mobile=req.body.mobilenumber;
    let gender=req.body.gender;
    var data={first_name:firstname,last_name:lastname,email:email}
    const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if (err) throw err
                data={first_name:firstname,last_name:lastname,email:email,phone_no:mobile,gender:gender,password:hash,type:"register normal"}
                let ins=new userModel(data);
    //console.log(data)
    ins.save((err)=>{
        console.log(err)
        if(err){ res.json({ "success": false,err:"user already added",message:"user already added."})}
        else{
        res.json({ "success": true,
        "status_code": 200,
        "message": `${firstname +lastname} was registered successfully`
    });
        }
    })
            });
        });
        
        
        
        
    }
    
    
const registerUserbySocial= async (req, res , next)=>{
    //console.log(req.body)
    let firstname=req.body.first_name;
    let lastname=req.body.last_name;
    let email=req.body.email;
    let mobile=req.body.mobilenumber;
    let gender=req.body.gender;
    var datavalue={first_name:firstname,last_name:lastname,email:email,type:"register social"}
    let token=jsonwebtoken.sign({ UID:email },jsonsecret,{ expiresIn: 60*60 })
    let ins=new userModel(datavalue);
    userModel.find({email:req.body.email},(err,data)=>{
        console.log(data)
        if(err) throw err;
        else{
        if(data.length==0)    {
            ins.save((err,result)=>{
                console.log(err)
                if(err){ res.json({success:false,data:result,err:"user already added",message:"user already added."})}
                else{
                res.json({ "data":result,
                    "success": true,
                "status_code": 200,
                "err":"",
                "message": `${firstname +lastname} was registered successfully`
                ,"token":token
            });
                }
            })
        }
        else{console.log(data[0].type)
            if(data[0].type=="register normal"){
                res.json({success:false,data:datavalue,err:"incorrect login",message:"login done by normally previously."})
            }
            else{
                
            
                res.json({ "data":data[0],
                    "success": true,
                    "status_code": 200,
                err:"",
                "message": `${firstname +lastname} was registered successfully`,
                "token":token
              })
            }
        }
        }
    })
    //console.log(data)
    
}


const getUser= async (req, res , next)=>{
    console.log("req.body")
    console.log(req.body)
    userModel.find({_id:req.body.userid},(err,data)=>{
        if(err) throw err;
        else{
            var data1=data
            console.log(data)
            if(data[0].gender==undefined){
                data1[0].gender="male"
            }
            if(data[0].phone_no==undefined){
                data1[0].phone_no=9999999998
            }
            if(data[0].DOB==undefined){
                data1[0].DOB="01/01/2000"
            }
            console.log(data1)
            res.send(data);}
        })
        console.log("getuser")
    }
    
    const loginUser= async (req, res , next)=>{
        let email=req.body.email;
    let password=req.body.password
    const saltRounds = 10;
    console.log(email,password)
    let token=jsonwebtoken.sign({ UID:email },jsonsecret,{ expiresIn: 60*60 }) //1 minute expire time for jwt token
    userModel.find({$and:[{email:email}]},(err,data)=>{
        if(err){
            res.json({"success" : false,err:err,message:"incorrect username And password."})
        }   
        else{
            console.log(data)
            if(data.length==0){
                res.json({"success" : false,err:"user not exist",message:"incorrect username And password."})
            }
            else{
            bcrypt.compare(password, data[0].password, function(err, result) {
                if(result){
                    const data1={
                    "first_name": data[0].first_name,
                    "last_name": data[0].last_name,
                    "email" : data[0].email ,
                    "phone_no": data[0].phone_no,
                    "gender": data[0].gender,
                    "userid":data[0]._id,
                    "profile_img":data[0].profile_img,
                    "address":data[0].Address
                }
                console.log(data1)
                if(data.length==0){
                    res.json({"success" : false,err:"user not exist",message:"incorrect username And password."})
                }
                else{
                    res.json({"success" : true,
                "status_code": 200,
                "message": "You have logged In",
                  "customer_details": data1,
                  "token":token
                });
                }
            }   
            else{
                res.json({"success" : false,err:err,message:"incorrect username And password."})
            }     
            
            });

        }
            
        }
    })
}
const deleteUser= async (req, res , next)=>{
    let id=req.params.id;
    userModel.deleteOne({_id:id},(err)=>{
        if(err) throw err 
        res.send("user Data Deleted .")
    })
}
const updateUser= async (req, res , next)=>{
    let id=req.body.id;
    let firstname=req.body.firstname;
    let lastname=req.body.lastname;
    let email=req.body.email;
    let phone_no=req.body.phone_no;
    let DOB=req.body.DOB;
    let gender=req.body.gender;
    console.log("11")
    console.log(req.body)
    console.log({first_name:firstname,last_name:lastname,email:email,phone_no:phone_no,DOB:DOB,gender:gender})
    userModel.updateOne({_id:id},{$set:{first_name:firstname,last_name:lastname,email:email,phone_no:phone_no,DOB:DOB,gender:gender}},(err,data)=>{
        if(err) throw err;
        else {
            console.log(data)
            res.json({data:{first_name:firstname,last_name:lastname,email:email,phone_no:phone_no,DOB:DOB,gender:gender},message:"user data Updated ."});
        }
    })
}
const forgetPasswordUser= async (req, res , next)=>{
    let email=req.body.email;
    let secret_code=Math.floor(Math.random()*10000)
    userModel.find({email:email},async(err,data)=>{
        if(err) throw err;
        else if(data.length==0){
            res.json({err:"1",msg:"user not found"})
        }
        else{
            let token = await tokenModel.findOne({ email: req.body.email });
            if (!token) {
            token = await new tokenModel({
                email: req.body.email,
                token: crypto.randomBytes(32).toString("hex"),
                secretcode: secret_code
            }).save();
        }
        main(token,email,"Forget Password",token.secretcode)
            res.json({data:email})
        }
    })
    
}
const updatePasswordUser= async (req, res , next)=>{
    console.log(req.body)
    const email=req.body.email
    const secretcode=req.body.secretcode
    const password=req.body.password
    tokenModel.find({$and:[{email:email}]},(err,data)=>{
        if(err){
            res.json({"success" : false,err:err,message:"incorrect token"})
        }   
        else{ if(data.length==0){
            res.json({"success" : false,err:err,message:"token expire"})
        }
        else{
            if(data[0].secretcode==secretcode){
                
                    if(req.body.password!==undefined){
                        const saltRounds = 10;
                        bcrypt.genSalt(saltRounds, function(err, salt) {
                            bcrypt.hash(req.body.password, salt, function(err, hash) {
                                if (err) throw err
                                userModel.updateOne({email:req.body.email},{$set:{password:hash}},(err)=>{
                                    if(err) throw err;
                                    else {
                            res.json({"success" : true,err:err,message:"Password Updated"});
                        }
                    })
                            });
                        });
                        
                    }
                }
                else{
                    res.json({"success" : false,err:err,message:"incorrect secret code"})
                }
            }
        }})
    
    }
    const changeprofileimage=(req,res,next)=>{
    multi_upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({ error: { message: `Multer uploading error1: ${err.message}` } }).end();
            return;
        } else if (err) {
            if (err.name == 'ExtensionError') {
                res.json({ err: err.name })
            } else {
                res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
            }
            return;
        }
        let image=req.files[0].filename;
        let email=req.body.email;
        //console.log(image)
        //console.log(email)
        userModel.findOne({email:email},(err,data)=>{
            if(data.profile_img!=undefined){
                fs.unlinkSync(path.join(__dirname, `../uploads/${data.profile_img}`))
            }
        })
        userModel.updateOne({email:email},{$set:{profile_img:image}},(err)=>{
            if(err) throw err;
            else {
                res.json({Status:"success",message:"Image Updated .",new_profile_img:image});
            }
        })
    })

}
const addAddress=(req,res,next)=>{
    const id=req.body.id
    console.log(req.body)
    const data={address:req.body.address,pincode:req.body.pincode,city:req.body.city,state:req.body.state,country:req.body.country}
    userModel.findOneAndUpdate(
        { _id: id }, 
        { $push: { 
                  Address:data
                } 
            }).exec((err,data)=>{
            console.log(err)
        })
    }
const updateAddress=(req,res,next)=>{
    
    const id=req.body.id
    const index=req.body.index
    
    console.log("1")
    console.log(req.body)
    const data={address:req.body.address,pincode:req.body.pincode,city:req.body.city,state:req.body.state,country:req.body.country}
           
    
    userModel.findOne({_id:id}).then(item => {
        item.Address[index] = data;
            item.save();
        });

    }
    const deleteAddress=(req,res,next)=>{
        const index=req.body.index
    console.log(req.body)
    userModel.findOne({_id:req.body.id}).then(item => {
        item.Address.splice(index,1);
        item.save();
        res.json({message:"delete address successfully",success:"true"})
    });
    
}
const getCart= async (req, res , next)=>{
    console.log("req.body")
    //console.log(req.headers)
    
    let cart = await cartModel.findOne({ email: req.body.email });
    if (!cart) {
        cart = await new cartModel({
                email: req.body.email,
                cart_data: []
            }).save();
        }
        await cartModel.find({email:req.body.email},(err,data)=>{
            if(err) throw err;
        else{
            res.send({data:data});}
        })
    console.log("getcart")
}

const updateCart= async (req, res , next)=>{
    //console.log("req.body")
    console.log(req.body)
    let cart = await cartModel.findOne({ email: req.body.email });
        if (!cart) {
            cart = await new cartModel({
                email: req.body.email,
                cart_data: []
            }).save();
        }
    await cartModel.updateOne({email:req.body.email},{$set:{cart_data:req.body.cart_data}},(err)=>{
        if(err) throw err;
        else {
            res.json({Status:"success",message:"cart Updated .",cart_data:req.body.cart_data});
        }
    })
    console.log("updatecart")
}
const removecart= async (req, res , next)=>{
    //console.log("req.body")
    console.log(req.body)
    cartModel.deleteMany({email: req.body.email}, function (err, _) {
        if (err) {
            return console.log(err);
        }
    });
    console.log("removecart")
}
const checkout= async (req, res , next)=>{
    
    //console.log(req.body)
    const data={email:req.body.email,order_data:req.body.order_data,address:req.body.address,paymentmethod:req.body.paymentmethod}
    const ins=orderModel(data)
    console.log(data)
    ins.save((err,result)=>{
        if (err) {
            console.log(err)
            res.json({data:"error"})
        }
        else{
            console.log("checkout done")
            res.json({data:result})
        }
    })
    console.log("checkout")
}

const getorder=async(req,res,next)=>{
    orderModel.find({email:req.body.email},(err,result)=>{
        if(err) {res.json({err:"err"})}
        else{
            res.json({data:result})
        }
    })
}
const getinvoice=async(req,res,next)=>{
    console.log(req.body)
    orderModel.findOne({_id:req.body.orderid},(err,result)=>{
        if(err) {res.json({err:"err"})}
        const invoice = {
            status:"Order Placed",
            order_date:result.order_date.toString().split(" ")[0]+" "+result.order_date.toString().split(" ")[1]+" "+result.order_date.toString().split(" ")[2]+" "+result.order_date.toString().split(" ")[3],
            order_id:result._id,
            discount:5,
            shipping: {
                name: req.body.name,
                address: result.address[0].address,
                city: result.address[0].city,
                state: result.address[0].state,
                country: result.address[0].country,
                pincode: result.address[0].pincode,
            },
            items: result.order_data
        };
        invoicegeneate(invoice,`./uploads/invoice/${req.body.orderid}.pdf`)
        res.json({data:`${req.body.orderid}.pdf`})
    })
}
module.exports= {registerUser,registerUserbySocial,getUser,loginUser,deleteUser,updateUser,forgetPasswordUser,updatePasswordUser,changeprofileimage,addAddress,updateAddress,deleteAddress,getCart,updateCart,checkout,removecart,getorder,getinvoice,autenticateToken}