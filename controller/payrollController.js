import Employee from "../models/employee.js";
import Payroll from "../models/payroll.js";
import PDFDocument from "pdfkit";

export async function genaratePayroll(req, res) {
    try {
        const { employeeID, month, year, baseSalary, allowances = 0, deductions = 0 } = req.body;
        if (!employeeID || !month || !year || !baseSalary) {
            return res.status(400).json({
                msg: "required all fields"
            });
        }
        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(400).json({
                msg: "employee not found"
            });
        }
        const existingPayroll = await Payroll.findOne({ employee: employee._id, month, year });
        if (existingPayroll) {
            return res.status(400).json({
                msg: "payroll already genarated for this month"
            });
        }
        const TAX_RATE = 0.2;
        const grossSalary = baseSalary + allowances - deductions;
        const annualSalary = grossSalary * 12;
        const tax = annualSalary * TAX_RATE;
        const netSalary = annualSalary - tax;

        const payroll = await Payroll.create({
            employee: employee._id,
            month,
            year,
            baseSalary,
            allowances,
            deductions,
            grossSalary,
            tax,
            netSalary,
        });
        res.status(201).json({
            msg: "payroll genarated successfully",
            payroll
        })
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};

export async function getPayrolls(req, res) {
    try {
        const payrolls = await Payroll.find().populate("employee", "departmentID name");
        res.status(200).json({ success: true, payrolls });
    } catch (err) {
        res.status(500).json({ success: false, error: "get payrolls server error" });
    }
}

export async function getpayrollsByemployeeID(req, res) {
    try {
        const { employeeID } = req.body;
        if (!employeeID) {
            return res.status(400).json({
                msg: "required employeeID"
            });
        }
        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(400).json({
                msg: "employee not found"
            });
        }
        const payrolls = await Payroll.find({ employee: employee._id })
            .sort({ year: -1, month: -1 });//latest payrolls first
        if (!payrolls.length) {
            return res.status(400).json({
                msg: "no records found"
            });
        }
        res.status(201).json({
            msg: "records get successfully",
            payrolls
        });

    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};

export async function getSingleSalarySlip(req, res) {
    try {
        const { employeeID, year, month } = req.body;
        if (!employeeID || !year || !month) {
            return res.status(400).json({
                msg: "required all fields"
            });
        }
        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(400).json({
                msg: "employee not found"
            });
        }
        const payroll = await Payroll.findOne({ employee: employee._id, year: year, month: month });
        if (!payroll) {
            return res.status(400).json({
                msg: "payroll not found"
            });
        }
        res.status(201).json({
            msg: "fetched payroll successfully",
            payroll
        })
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};
export async function generatePayslip(req, res) {
    try {
        const { payrollId } = req.params;

        const payroll = await Payroll.findById(payrollId).populate("employee");
        if (!payroll) {
            return res.status(404).json({ msg: "Payroll not found" });
        }

        const doc = new PDFDocument({ margin: 50 });
        let filename = `Payslip_${payroll.employee.name}_${payroll.month}_${payroll.year}.pdf`;
        filename = encodeURIComponent(filename);

        // Set response headers for PDF download
        res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-type", "application/pdf");

        // Pipe PDF to response
        doc.pipe(res);

        // ====== PDF Content ======

        doc
            .fontSize(20)
            .text("Company Name", { align: "center" })
            .moveDown(0.5);

        doc
            .fontSize(16)
            .text("Payslip", { align: "center" })
            .moveDown(1);

        // Employee details
        doc.fontSize(12).text(`Employee Name: ${payroll.employee.name}`);
        doc.text(`Employee ID: ${payroll.employee.employeeID}`);
        doc.text(`Month/Year: ${payroll.month} / ${payroll.year}`);
        doc.moveDown(0.5);

        // Salary details
        doc.text(`Base Salary: ${payroll.baseSalary.toFixed(2)}`);
        doc.text(`Allowances: ${payroll.allowances.toFixed(2)}`);
        doc.text(`Deductions: ${payroll.deductions.toFixed(2)}`);
        doc.text(`Gross Salary: ${payroll.grossSalary.toFixed(2)}`);
        doc.text(`Tax (20%): ${payroll.tax.toFixed(2)}`);
        doc.text(`Net Salary: ${payroll.netSalary.toFixed(2)}`);
        doc.moveDown(1);

        doc.text("Thank you for your hard work!", { align: "center" });

        doc.end(); // Finish PDF

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}