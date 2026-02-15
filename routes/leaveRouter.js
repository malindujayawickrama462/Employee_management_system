import express from "express";
import { addLeave, getLeaves, getEmployeeLeaves, updateLeaveStatus } from "../controller/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authRole.js";

const leaveRouter = express.Router();

leaveRouter.post("/add", protect, addLeave);
leaveRouter.get("/get", protect, authorizeRoles("admin", "hr"), getLeaves);
leaveRouter.get("/employee/:employeeID", protect, getEmployeeLeaves);
leaveRouter.put("/update/:id", protect, authorizeRoles("admin", "hr"), updateLeaveStatus);

export default leaveRouter;
