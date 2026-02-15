import Leave from "../models/leave.js";
import Employee from "../models/employee.js";

export const addLeave = async (req, res) => {
    try {
        const { employeeID, leaveType, startDate, endDate, reason } = req.body;

        if (!employeeID || !leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, msg: "Please provide all required fields" });
        }

        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(404).json({ success: false, msg: "Employee not found" });
        }

        const newLeave = await Leave.create({
            employeeID,
            leaveType,
            startDate,
            endDate,
            reason
        });

        res.status(201).json({ success: true, leave: newLeave });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ appliedAt: -1 });
        res.status(200).json({ success: true, leaves });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const getEmployeeLeaves = async (req, res) => {
    try {
        const { employeeID } = req.params;
        const leaves = await Leave.find({ employeeID }).sort({ appliedAt: -1 });
        res.status(200).json({ success: true, leaves });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ success: false, msg: "Invalid status" });
        }

        const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
        if (!leave) {
            return res.status(404).json({ success: false, msg: "Leave record not found" });
        }

        res.status(200).json({ success: true, leave });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
