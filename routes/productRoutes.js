const express=require('express')
const router=express.Router()
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const productController =require('../controller/ProductController')
router.get("/getproduct",productController.getProducts)
router.get("/getproductbyid/:id",productController.getProductsbyid)
router.get("/getproductbyiddata/:id",productController.getProductsbyiddata)
router.get("/getproductbycolor/:id",productController.getProductsbyidcolor)
router.get("/getcategory",productController.getcategory)
router.get("/getcolor",productController.getcolor)


module.exports=router;