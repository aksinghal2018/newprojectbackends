const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    category_name:{
        type:String,
        require:true
    },
    category_image:{
        type:String,
        require:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    __V:{
        type:String,
        default:"0"
    }
})
module.exports = mongoose.model("category", categorySchema)