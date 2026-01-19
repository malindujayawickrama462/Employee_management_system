import express from "express";
import { genaratePayroll, generatePayslip, getpayrollsByemployeeID, getSingleSalarySlip } from "../controller/payrollController.js";

const payrollRouter = express.Router();

payrollRouter.post("/add",genaratePayroll);
payrollRouter.get("/get",getpayrollsByemployeeID);
payrollRouter.get("/singleGet",getSingleSalarySlip);
payrollRouter.get("/payslip/:payrollId",generatePayslip);

export default payrollRouter; 