import express from "express";
import {
    addPerformance,
    getAllPerformances,
    getPerformanceByEmployee,
    updatePerformance,
    deletePerformance
} from "../controller/performanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authRole.js";

const performanceRouter = express.Router();

// All routes are protected
performanceRouter.use(protect);

// Admin and HR can manage all reviews
performanceRouter.post("/add", authorizeRoles("admin", "hr"), addPerformance);
performanceRouter.get("/", authorizeRoles("admin", "hr"), getAllPerformances);
performanceRouter.put("/update/:id", authorizeRoles("admin", "hr"), updatePerformance);
performanceRouter.delete("/:id", authorizeRoles("admin", "hr"), deletePerformance);

// Any authenticated user can potentially view reviews, but getPerformanceByEmployee handles ownership checks
performanceRouter.get("/employee/:employeeID", getPerformanceByEmployee);

export default performanceRouter;
