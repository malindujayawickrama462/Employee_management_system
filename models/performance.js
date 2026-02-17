import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        required: true
    },
    reviewerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    period: {
        type: String, // e.g., "Q1 2024", "Annual 2023"
        required: true
    },
    kpis: [
        {
            name: { type: String, required: true },
            score: { type: Number, required: true, min: 0, max: 100 },
            target: { type: Number, required: true },
            comment: { type: String }
        }
    ],
    appraisalRecord: {
        type: String,
        required: true
    },
    feedback: {
        type: String
    },
    overallRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ["Draft", "Submitted", "Acknowledged"],
        default: "Draft"
    }
}, {
    timestamps: true
});

const Performance = mongoose.model("performance", performanceSchema);
export default Performance;
