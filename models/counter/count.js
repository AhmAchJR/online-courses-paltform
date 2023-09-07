const mongoose = require('mongoose');

const counterModel = mongoose.Schema({
    _id:{type:String,require:true},
    sequence_value:{type:Number,default:0}
})
module.exports = mongoose.model('count',counterModel);