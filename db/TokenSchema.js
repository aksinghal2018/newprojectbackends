const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    email: {
        type:String,
    require:true    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120,
    },
    secretcode:{
        type:Number,
        require:true
    }
});

module.exports = mongoose.model("token", tokenSchema);