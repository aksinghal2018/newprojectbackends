const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone_no: {
        type: Number,
    },
    gender: {
        type: String,
    },
    password: {
        type: String
    },
    profile_img:{
        type:String
    },
    DOB:{
        type:String
    },
    Address:{
        type:Array
    },
    type:{
        type:String
    }
})
module.exports = mongoose.model("user", userSchema)