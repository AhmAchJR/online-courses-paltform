const mongoose = require("mongoose");
const counterModel = require('./counter/count');

const courseSchema = new mongoose.Schema({
  ID:{type:Number,unique:true,require:true},
  name: { type: String, required: true },
  description: { type: String },
  watingstudentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  enrolledstudentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "review" }],
  Date: {
    type: Date,
    required: true,
    match: /^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/,
  },
  image: { type: String, required: true },
  lessons: [
    { type: mongoose.Schema.Types.ObjectId, ref: "lesson" },
  ],
});

courseSchema.pre('save', function (next){
  const  doc =this;
 counterModel.findByIdAndUpdate({_id:'courseId'},{$inc:{sequence_value:1}},{new: true, upsert: true})
             .then(function (count){
                 doc.ID = count.sequence_value;
              //   console.log(doc.ID);
                 next();
             })//then
             .catch(err =>{
                 console.log('counter error-> : ', err);
                 throw err;
             })//catch
})//pre

module.exports = mongoose.model("Course", courseSchema);
