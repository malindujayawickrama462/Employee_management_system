import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        required: true
    },
    leaveType: {
        type: String,
        enum: ["Sick Leave", "Casual Leave", "Annual Leave", "Maternity Leave", "Paternity Leave"],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Leave = mongoose.model("leave", leaveSchema);
export default Leave;
