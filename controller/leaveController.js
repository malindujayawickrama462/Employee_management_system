import Leave from "../models/leave.js";
import Employee from "../models/employee.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";


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

        // Notify Employee
        const employee = await Employee.findOne({ employeeID: leave.employeeID });
        if (employee) {
            const user = await User.findOne({ email: employee.email });
            if (user) {
                await Notification.create({
                    recipient: user._id,
                    title: `Leave Request ${status}`,
                    message: `Your ${leave.leaveType} request from ${new Date(leave.startDate).toLocaleDateString()} has been ${status.toLowerCase()}.`,
                    type: "leave"
                });
            }
        }

        res.status(200).json({ success: true, leave });

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};
