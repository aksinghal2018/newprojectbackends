const mongoose = require('mongoose')
const colorSchema = new mongoose.Schema({
    color_name:{
        type:String,
        require:true
    },
    color_code:{
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
module.exports = mongoose.model("color", colorSchema)