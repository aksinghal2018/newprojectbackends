const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    product_subImages:{
        type:[String],
        require:true
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    color_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"color"
    },
    product_name:{
        type:String,
        require:true,
        unique:true
    },
    product_image:{
        type:String,
        require:true
    },
    product_desc:{
        type:String,
        require:true
    },
    product_rating:{
        type:Number,
        require:true
    },
    product_producer:{
        type:String,
        require:true
    },
    product_cost:{
        type:Number,
        require:true
    },
    product_stock:{
        type:Number,
        require:true
    },
    product_dimension:{
        type:String,
        require:true
    },
    product_material:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("product", productSchema)

