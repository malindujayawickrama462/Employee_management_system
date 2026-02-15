import express from "express";
import { getUser, loginUser, RegisterUser, changePassword } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authRole.js";

const userRouter = express.Router();

userRouter.post("/add", RegisterUser);
userRouter.post("/login", loginUser);
userRouter.get("/get", protect, authorizeRoles("admin", "hr", "employee"), getUser);
userRouter.post("/change-password", protect, changePassword);

export default userRouter;