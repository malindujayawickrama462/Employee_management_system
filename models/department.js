import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    departmentID:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"employee",
    },
    employees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"employee",
    }]
},
{
    timestamps:true
});
const Department = mongoose.model("department",departmentSchema);
export default Department;