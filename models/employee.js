import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    },
    nic: {
        type: String,
        required: true,
    },
    position: {
        type: String
    },
    salary: {
        type: Number
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department"
    },
    dob: {
        type: Date
    },
    contractExpiry: {
        type: Date
    }
}, {
    timestamps: true
});


const Employee = mongoose.model("employee", EmployeeSchema);

export default Employee;