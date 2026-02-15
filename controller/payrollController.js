import Employee from "../models/employee.js";
import Payroll from "../models/payroll.js";
import PDFDocument from "pdfkit";

// Generate payroll for a single employee
export async function generatePayroll(req, res) {
    try {
        const { employeeID, month, year, baseSalary, allowances = 0, deductions = 0 } = req.body;

        if (!employeeID || !month || !year || !baseSalary) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        const existingPayroll = await Payroll.findOne({ employee: employee._id, month, year });
        if (existingPayroll) {
            return res.status(400).json({ msg: "Payroll already generated for this month" });
        }

        // Calculation: Standard 20% tax on monthly gross
        const grossSalary = Number(baseSalary) + Number(allowances) - Number(deductions);
        const tax = grossSalary * 0.20;
        const netSalary = grossSalary - tax;

        const payroll = await Payroll.create({
            employee: employee._id,
            month,
            year,
            baseSalary: Number(baseSalary),
            allowances: Number(allowances),
            deductions: Number(deductions),
            grossSalary,
            tax,
            netSalary,
        });

        res.status(201).json({
            msg: "Payroll generated successfully",
            payroll
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Generate payroll for all employees
export async function generateBulkPayroll(req, res) {
    try {
        const { month, year } = req.body;
        if (!month || !year) {
            return res.status(400).json({ msg: "Month and Year are required" });
        }

        const employees = await Employee.find();
        let createdCount = 0;
        let skippedCount = 0;

        for (const employee of employees) {
            const existing = await Payroll.findOne({ employee: employee._id, month, year });
            if (existing) {
                skippedCount++;
                continue;
            }

            const baseSalary = employee.salary || 0;
            if (baseSalary === 0) {
                skippedCount++;
                continue;
            }

            const grossSalary = baseSalary; // Bulk uses default base
            const tax = grossSalary * 0.20;
            const netSalary = grossSalary - tax;

            await Payroll.create({
                employee: employee._id,
                month,
                year,
                baseSalary,
                allowances: 0,
                deductions: 0,
                grossSalary,
                tax,
                netSalary
            });
            createdCount++;
        }

        res.status(201).json({
            msg: `Bulk payroll completed. Created: ${createdCount}, Skipped: ${skippedCount}`,
            createdCount,
            skippedCount
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

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
        const { employeeID } = req.query; // Use query for GET
        if (!employeeID) {
            return res.status(400).json({ msg: "employeeID required" });
        }
        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        // Ownership Check: Employees can only see their own records
        if (req.user.role === 'employee' && employee.email !== req.user.email) {
            return res.status(403).json({ msg: "You can only access your own payroll records" });
        }

        const payrolls = await Payroll.find({ employee: employee._id })
            .sort({ year: -1, month: -1 });

        res.status(200).json({
            msg: "Records fetched successfully",
            payrolls
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

export async function getSingleSalarySlip(req, res) {
    try {
        const { employeeID, year, month } = req.query; // Use query for GET
        if (!employeeID || !year || !month) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        const employee = await Employee.findOne({ employeeID });
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        const payroll = await Payroll.findOne({ employee: employee._id, year, month });
        if (!payroll) {
            return res.status(404).json({ msg: "Payroll not found" });
        }
        res.status(200).json({
            msg: "Fetched payroll successfully",
            payroll
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
export async function generatePayslip(req, res) {
    try {
        const { payrollId } = req.params;

        const payroll = await Payroll.findById(payrollId).populate("employee");
        if (!payroll) {
            return res.status(404).json({ msg: "Payroll not found" });
        }

        // Ownership Check: Employees can only download their own payslips
        if (req.user.role === 'employee' && payroll.employee.email !== req.user.email) {
            return res.status(403).json({ msg: "You can only download your own payslip" });
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

export async function deletePayroll(req, res) {
    try {
        const { id } = req.params;
        const payroll = await Payroll.findByIdAndDelete(id);

        if (!payroll) {
            return res.status(404).json({ msg: "Payroll record not found" });
        }

        res.status(200).json({
            msg: "Payroll record deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}