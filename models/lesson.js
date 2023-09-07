const mongoose = require("mongoose");
const counterModel = require('./counter/count');

const lessonSchema = new mongoose.Schema({
  ID:{type:Number,unique:true,require:true},
  name: { type: String, required: true },
  description: { type: String, required: true },
  link:{type: String, required: true},
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});
lessonSchema.pre('save', function (next){
  const  doc =this;
 counterModel.findByIdAndUpdate({_id:'lessonId'},{$inc:{sequence_value:1}},{new: true, upsert: true})
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
module.exports = mongoose.model("lesson", lessonSchema);