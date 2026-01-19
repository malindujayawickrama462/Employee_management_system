import express from "express";
import { AddEmployee, deleteEmployee, getEmployeeByID, getEmployees, UpdateEmployee } from "../controller/employeeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",AddEmployee);

router.get("/",getEmployees);

router.get("/:ID",protect,getEmployeeByID);

router.put("/:ID",UpdateEmployee);

router.delete("/:ID",deleteEmployee);

export default router;