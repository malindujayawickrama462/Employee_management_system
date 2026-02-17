import express from "express";
import connection from "./config/db.js";
import router from "./routes/employees.js";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import depRouter from "./routes/departmentRouter.js";
import payrollRouter from "./routes/payroll.js";
import leaveRouter from "./routes/leaveRouter.js";
import performanceRouter from "./routes/performanceRouter.js";

const app = express();
//DB connection
connection();
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

app.get("/", (req, res) => res.send("Hello world"));
app.use("/api/employee", router)
app.use("/api/user", userRouter)
app.use("/api/dep", depRouter)
app.use("/api/payroll", payrollRouter)
app.use("/api/leave", leaveRouter)
app.use("/api/performance", performanceRouter)


const port = 3000;
app.listen(port, () => {
    console.log(`sever is running on port ${port}`)
}); 