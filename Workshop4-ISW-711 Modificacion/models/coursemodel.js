const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const course=new Schema({
    name: {type:String},
    code:{type:String},
    description:{type:String},
    teacher: {
        type: mongoose.ObjectId,
        ref: 'teacher'
      }
})

module.exports=mongoose.model("course",course);