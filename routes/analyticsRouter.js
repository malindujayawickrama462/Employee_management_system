import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
    getOverviewStats,
    getDepartmentWiseStats,
    getPayrollTrends,
    getEmployeeRoleDistribution,
    getIndividualEmployeeReport,
    getIndividualEmployeePDF
} from "../controller/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/overview", protect, authorizeRoles("admin", "hr"), getOverviewStats);
analyticsRouter.get("/departments", protect, authorizeRoles("admin", "hr"), getDepartmentWiseStats);
analyticsRouter.get("/payroll-trends", protect, authorizeRoles("admin", "hr"), getPayrollTrends);
analyticsRouter.get("/roles", protect, authorizeRoles("admin", "hr"), getEmployeeRoleDistribution);
analyticsRouter.get("/report/:employeeID", protect, authorizeRoles("admin", "hr"), getIndividualEmployeeReport);
analyticsRouter.get("/report/:employeeID/pdf", protect, authorizeRoles("admin", "hr"), getIndividualEmployeePDF);



export default analyticsRouter;
