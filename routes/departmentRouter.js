import express from "express";
import {
    addDepartment,
    addEmployeeToDepartment,
    assignManager,
    getDepartments,
    updateDepartment,
    deleteDepartment,
    getEmployeesByDepartment,
    removeManager,
    transferEmployee
} from "../controller/departmentController.js";

const depRouter = express.Router();

depRouter.post("/add", addDepartment)
depRouter.get("/get", getDepartments)
depRouter.put("/update/:id", updateDepartment)
depRouter.delete("/delete/:id", deleteDepartment)
depRouter.put("/assign-m", assignManager)
depRouter.put("/delete-m", removeManager)
depRouter.put("/add-e", addEmployeeToDepartment);
depRouter.get("/get-e", getEmployeesByDepartment);
depRouter.put("/transfer", transferEmployee);

export default depRouter;

