import Notification from "../models/notification.js";
import User from "../models/user.js";

/**
 * Notification Controller
 */

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, msg: "Notification not found" });
        }
        res.status(200).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, msg: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Internal helper for other controllers
export const createInternalNotification = async (recipientId, title, message, type) => {
    try {
        await Notification.create({
            recipient: recipientId,
            title,
            message,
            type
        });
    } catch (error) {
        console.error("Failed to create internal notification", error);
    }
};
