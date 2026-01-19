import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"employee",
        required:true
    },
    month:String,
    year:Number,

    baseSalary:Number,
    allowances:Number,
    deductions:Number,

    grossSalary:Number,
    tax:Number,
    netSalary:Number,

    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Payroll = mongoose.model("payroll",payrollSchema);
export default Payroll; 