const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    cart_data:{
        type:Array
    }
})
module.exports = mongoose.model("cart", cartSchema)