import express from "express";
import { generatePayroll, generateBulkPayroll, generatePayslip, getpayrollsByemployeeID, getSingleSalarySlip, getPayrolls, deletePayroll } from "../controller/payrollController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const payrollRouter = express.Router();

// All payroll routes are protected by JWT authentication
payrollRouter.use(protect);

// Admin and Manager can manage all payroll (Bulk/Single generation and full list)
payrollRouter.post("/add", authorizeRoles("admin", "manager"), generatePayroll);
payrollRouter.post("/bulk", authorizeRoles("admin", "manager"), generateBulkPayroll);
payrollRouter.get("/", authorizeRoles("admin", "manager"), getPayrolls);
payrollRouter.get("/singleGet", authorizeRoles("admin", "manager"), getSingleSalarySlip);

// Employees can view their own payroll records and download their own payslips
// Stricter ownership checks are implemented within the controller functions
payrollRouter.get("/get", getpayrollsByemployeeID);
payrollRouter.get("/payslip/:payrollId", generatePayslip);
payrollRouter.delete("/:id", authorizeRoles("admin", "manager"), deletePayroll);

export default payrollRouter;
