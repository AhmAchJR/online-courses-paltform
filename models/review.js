const mongoose = require("mongoose");
const counterModel = require('./counter/count');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String , required: true},
  description: { type: String, required: true },
});


module.exports = mongoose.model("review", reviewSchema);
