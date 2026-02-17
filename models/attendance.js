import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Late", "On Leave"],
        required: true
    },
    checkIn: {
        type: String
    },
    checkOut: {
        type: String
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate attendance records for the same employee on the same day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("attendance", attendanceSchema);
export default Attendance;
