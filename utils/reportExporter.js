import PDFDocument from 'pdfkit';

/**
 * reportExporter.js - Utility for generating professional PDF reports
 */

export const generateEmployeePDF = (data, stream) => {
    const { employee, performanceHistory, payrollHistory, leaveStats } = data;
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(stream);

    // --- Header ---
    doc.fillColor("#4F46E5").fontSize(25).text("EMPLOYEE INTELLIGENCE REPORT", { align: "center" });
    doc.moveDown();
    doc.strokeColor("#E5E7EB").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // --- Profile Section ---
    doc.fillColor("#111827").fontSize(16).text(`PROFILE: ${employee.name}`, { underline: true });
    doc.fontSize(10).fillColor("#4B5563");
    doc.text(`Employee ID: ${employee.employeeID}`);
    doc.text(`Email: ${employee.email}`);
    doc.text(`Position: ${employee.position}`);
    doc.text(`Department: ${employee.department?.name || "N/A"}`);
    doc.text(`Status: ${employee.status || "Active"}`);
    doc.moveDown();

    // --- Performance History ---
    doc.fillColor("#4F46E5").fontSize(14).text("PERFORMANCE METRICS", { underline: true });
    doc.moveDown(0.5);
    if (performanceHistory && performanceHistory.length > 0) {
        performanceHistory.forEach((perf, index) => {
            doc.fillColor("#111827").fontSize(10).text(`${index + 1}. Period: ${perf.period} | Rating: ${perf.overallRating}/5`);
            doc.fillColor("#6B7280").fontSize(9).text(`   Reviewer: ${perf.reviewerID?.name || "N/A"}`);
            doc.text(`   Feedback: ${perf.feedback || "No feedback provided."}`);
            doc.moveDown(0.5);
        });
    } else {
        doc.fillColor("#9CA3AF").fontSize(10).text("No performance reviews found.");
    }
    doc.moveDown();

    // --- Payroll Summary ---
    doc.fillColor("#4F46E5").fontSize(14).text("PAYROLL HISTORY (LAST 12 MONTHS)", { underline: true });
    doc.moveDown(0.5);
    if (payrollHistory && payrollHistory.length > 0) {
        doc.fillColor("#111827").fontSize(10);
        payrollHistory.forEach(pay => {
            doc.text(`${pay.month} ${pay.year} : Gross: $${pay.grossSalary.toLocaleString()} | Net: $${pay.netSalary.toLocaleString()}`);
        });
    } else {
        doc.fillColor("#9CA3AF").fontSize(10).text("No payroll records found.");
    }
    doc.moveDown();

    // --- Leave Statistics ---
    doc.fillColor("#4F46E5").fontSize(14).text("LEAVE UTILIZATION", { underline: true });
    doc.moveDown(0.5);
    if (leaveStats && leaveStats.length > 0) {
        leaveStats.forEach(stat => {
            doc.fillColor("#111827").fontSize(10).text(`${stat._id}: ${stat.count} occurrences`);
        });
    } else {
        doc.fillColor("#9CA3AF").fontSize(10).text("No leave records found.");
    }

    // --- Footer ---
    const pageCount = doc.bufferedPageRange().count;
    doc.fontSize(8).fillColor("#9CA3AF").text(
        `Generated on ${new Date().toLocaleString()} | Secure Protocol v2.0`,
        50,
        doc.page.height - 50,
        { align: "center", width: 500 }
    );

    doc.end();
};
