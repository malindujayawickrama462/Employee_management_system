import express from "express";
import { AddEmployee, deleteEmployee, getEmployeeByID, getEmployees, UpdateEmployee, getMe, updateMe } from "../controller/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/update-me", protect, updateMe);

router.post("/", AddEmployee);

router.get("/", getEmployees);

router.get("/:ID", protect, getEmployeeByID);

router.put("/:ID", UpdateEmployee);

router.delete("/:ID", deleteEmployee);

export default router;