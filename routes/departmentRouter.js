import express from "express";
import { addDepartment, 
    addEmployeeToDepartment, 
    assignManager, 
    getEmployeesByDepartment, 
    removeManager, 
    transferEmployee} from "../controller/departmentController.js";

const depRouter = express.Router();

depRouter.post("/add",addDepartment)
depRouter.put("/assign-m/",assignManager)
depRouter.put("/delete-m",removeManager)
depRouter.put("/add-e",addEmployeeToDepartment);
depRouter.get("/get-e",getEmployeesByDepartment);
depRouter.put("/transfer",transferEmployee);

export default depRouter; 

