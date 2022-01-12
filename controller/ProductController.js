const productModel=require('../db/Products/productSchema');
const categoryModel=require('../db/Products/categorySchema');
const colorModel=require('../db/Products/colorSchema');
const mongoose = require('mongoose')

const autenticateToken= async(req,res,next)=>{
    if(req!=undefined){
        const token=req.query.token
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
const getProducts= async (req, res , next)=>{
    productModel.find({},{"product_name":1,"product_cost":1,"product_rating":1,"product_producer":1,"product_subImages":1,"category_id":1}).populate(['category_id']).exec((err,data)=>{
        // console.log(err)
         if(err){ res.json({err:"not found",message:"product not found"})}
         else{
         res.json({ "success": true,
         "status_code": 200,
         "data":data
       });
         }
     })
}
const getProductsbyid= async (req, res , next)=>{
    const id=req.params.id
    console.log("getproductbyid")
    productModel.find({},{"product_name":1,"product_cost":1,"product_rating":1,"product_subImages":1,"category_id":1}).populate(['category_id']).exec((err,data)=>{
        const data1=[]
        data.map(function(doc){
            if(doc.category_id!=null){
                if(doc.category_id.category_name==id){
                    data1.push(doc)
                }
            }
          })
            res.json({data:data1})
        //console.log(err)
    })
}
const getProductsbyiddata= async (req, res , next)=>{
    const id=req.params.id
    productModel.find({_id:id}).populate(['category_id','color_id']).exec((err,data)=>{
            res.json({data:data})
        //console.log(err)
    })
}
const getProductsbyidcolor= async (req, res , next)=>{
    const id=req.params.id
    console.log(id)
    productModel.find({color_id:mongoose.Types.ObjectId(id)},{"product_name":1,"product_cost":1,"product_rating":1,"product_subImages":1,"category_id":1,"color_id":1}).populate(['category_id','color_id']).exec((err,data)=>{
        const data1=[]
        console.log(data)
        
            res.json({data:data})
        //console.log(err)
    })
}
const getcategory= async (req, res , next)=>{
    categoryModel.find({},(err,data)=>{
        console.log(err)
        if(err){ res.json({err:"not found",message:"product not found"})}
        else{
        res.json({ "success": true,
        "status_code": 200,
        "data":data
      });
        }
    })
    console.log("getproduct")
}
const getcolor= async (req, res , next)=>{
    colorModel.find({},(err,data)=>{
        console.log(err)
        if(err){ res.json({err:"not found",message:"product not found"})}
        else{
        res.json({ "success": true,
        "status_code": 200,
        "data":data
      });
        }
    })
    console.log("getproduct")
}

module.exports={autenticateToken,getProducts,getProductsbyid,getProductsbyiddata,getcategory,getcolor,getProductsbyidcolor}