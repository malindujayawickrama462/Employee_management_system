import Performance from "../models/performance.js";
import Employee from "../models/employee.js";

// Add a new performance review
export async function addPerformance(req, res) {
    try {
        const { employeeID, period, kpis, appraisalRecord, feedback, overallRating, status } = req.body;

        // Verify employee exists
        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(404).json({ success: false, msg: "Employee not found" });
        }

        const performance = await Performance.create({
            employeeID,
            reviewerID: req.user.id,
            period,
            kpis,
            appraisalRecord,
            feedback,
            overallRating,
            status: status || "Submitted"
        });

        res.status(201).json({ success: true, data: performance });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
}

// Get all performance reviews
export async function getAllPerformances(req, res) {
    try {
        const performances = await Performance.find()
            .populate("reviewerID", "name email")
            .sort({ reviewDate: -1 });
        res.status(200).json({ success: true, data: performances });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
}

// Get performance reviews for a specific employee
export async function getPerformanceByEmployee(req, res) {
    try {
        const { employeeID } = req.params;

        // Security check: Employees can only see their own reviews
        // Admin and HR can see anyone's
        if (req.user.role === "employee") {
            const employee = await Employee.findOne({ email: req.user.email });
            if (!employee || employee.employeeID !== employeeID) {
                return res.status(403).json({ success: false, msg: "Access denied" });
            }
        }

        const performances = await Performance.find({ employeeID })
            .populate("reviewerID", "name email")
            .sort({ reviewDate: -1 });

        res.status(200).json({ success: true, data: performances });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
}

// Update a performance review
export async function updatePerformance(req, res) {
    try {
        const { id } = req.params;
        const performance = await Performance.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!performance) {
            return res.status(404).json({ success: false, msg: "Performance record not found" });
        }

        res.status(200).json({ success: true, data: performance });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
}

// Delete a performance review
export async function deletePerformance(req, res) {
    try {
        const { id } = req.params;
        const performance = await Performance.findByIdAndDelete(id);

        if (!performance) {
            return res.status(404).json({ success: false, msg: "Performance record not found" });
        }

        res.status(200).json({ success: true, msg: "Performance record deleted successfully" });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
}
