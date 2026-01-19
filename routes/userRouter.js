import express from "express";
import { getUser, loginUser, RegisterUser } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/add",RegisterUser); 
userRouter.post("/login",loginUser);
userRouter.get("/get",protect,getUser);

export default userRouter;