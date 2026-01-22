import express from "express";
import connection from "./config/db.js";
import router from "./routes/employees.js";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import depRouter from "./routes/departmentRouter.js";
import payrollRouter from "./routes/payroll.js";

const app = express();
//DB connection
connection();
app.use(cors({ origin: "http://localhost:5173" }));  
app.use(express.json());

app.get("/",(req,res)=>res.send("Hello world"));
app.use("/api/employee",router)
app.use("/api/user",userRouter)
app.use("/api/dep",depRouter)
app.use("/api/pay",payrollRouter)

const port = 3000;
app.listen(port,()=>{ 
    console.log(`sever is running on port ${port}`)
}); 