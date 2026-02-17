import Employee from "../models/employee.js";
import Department from "../models/department.js";
import Payroll from "../models/payroll.js";
import Performance from "../models/performance.js";
import Attendance from "../models/attendance.js";
import Leave from "../models/leave.js";
import { generateEmployeePDF } from "../utils/reportExporter.js";

/**
 * Analytics Controller - Aggregates data for reporting
 */

export const getOverviewStats = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const totalDepartments = await Department.countDocuments();

        const payrollSummary = await Payroll.aggregate([
            { $group: { _id: null, totalPayout: { $sum: "$netSalary" }, avgSalary: { $avg: "$netSalary" } } }
        ]);

        const performanceAvg = await Performance.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$overallRating" } } }
        ]);

        res.status(200).json({
            success: true,
            totalEmployees,
            totalDepartments,
            totalPayout: payrollSummary[0]?.totalPayout || 0,
            avgNetSalary: payrollSummary[0]?.avgSalary || 0,
            avgPerformance: performanceAvg[0]?.avgRating || 0
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

export const getDepartmentWiseStats = async (req, res) => {
    try {
        const stats = await Employee.aggregate([
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "deptInfo"
                }
            },
            { $unwind: "$deptInfo" },
            {
                $project: {
                    name: "$deptInfo.name",
                    count: 1
                }
            }
        ]);

        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

export const getPayrollTrends = async (req, res) => {
    try {
        const trends = await Payroll.aggregate([
            {
                $group: {
                    _id: { month: "$month", year: "$year" },
                    total: { $sum: "$netSalary" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        res.status(200).json({ success: true, data: trends });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

export const getEmployeeRoleDistribution = async (req, res) => {
    try {
        const distribution = await Employee.aggregate([
            {
                $group: {
                    _id: "$position",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ success: true, data: distribution });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

export const getIndividualEmployeeReport = async (req, res) => {
    try {
        const { employeeID } = req.params;

        const employee = await Employee.findOne({ employeeID })
            .populate("department", "name");

        if (!employee) {
            return res.status(404).json({ success: false, msg: "Employee not found" });
        }

        const performanceHistory = await Performance.find({ employeeID })
            .populate("reviewerID", "name")
            .sort({ reviewDate: -1 });

        const payrollHistory = await Payroll.find({ employee: employee._id })
            .sort({ year: -1, month: -1 })
            .limit(12);

        const leaveStats = await Leave.aggregate([
            { $match: { employeeID } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                employee,
                performanceHistory,
                payrollHistory,
                leaveStats
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

export const getIndividualEmployeePDF = async (req, res) => {
    try {
        const { employeeID } = req.params;

        const employee = await Employee.findOne({ employeeID })
            .populate("department", "name");

        if (!employee) {
            return res.status(404).json({ success: false, msg: "Employee not found" });
        }

        const performanceHistory = await Performance.find({ employeeID })
            .populate("reviewerID", "name")
            .sort({ reviewDate: -1 });

        const payrollHistory = await Payroll.find({ employee: employee._id })
            .sort({ year: -1, month: -1 })
            .limit(12);

        const leaveStats = await Leave.aggregate([
            { $match: { employeeID } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Report_${employeeID}.pdf`);

        generateEmployeePDF({ employee, performanceHistory, payrollHistory, leaveStats }, res);

    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
