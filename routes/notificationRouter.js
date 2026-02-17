import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from "../controller/notificationController.js";
import { checkScheduledAlerts } from "../utils/alertService.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protect, getNotifications);
notificationRouter.get("/check-alerts", protect, checkScheduledAlerts);
notificationRouter.put("/:id/read", protect, markAsRead);
notificationRouter.put("/read-all", protect, markAllAsRead);

export default notificationRouter;
