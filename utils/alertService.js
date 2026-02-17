import Employee from "../models/employee.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";

/**
 * Alert Service - Handles scheduled/recurring alerts
 */

export const checkScheduledAlerts = async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const employees = await Employee.find();

        for (const emp of employees) {
            const user = await User.findOne({ email: emp.email });
            if (!user) continue;

            // 1. Check Birthdays (Upcoming in next 7 days)
            if (emp.dob) {
                const dob = new Date(emp.dob);
                const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

                const diffTime = birthdayThisYear - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0 && diffDays <= 7) {
                    const title = diffDays === 0 ? "Happy Birthday!" : "Upcoming Birthday";
                    const message = diffDays === 0
                        ? `Happy Birthday, ${emp.name}! Wishing you a fantastic day.`
                        : `Your birthday is coming up in ${diffDays} days!`;

                    await createDuplicateCheckedNotification(user._id, title, message, 'birthday');
                }
            }

            // 2. Check Contract Expiry (Within 30 days)
            if (emp.contractExpiry) {
                const expiry = new Date(emp.contractExpiry);
                const diffTime = expiry - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays >= 0 && diffDays <= 30) {
                    const title = "Contract Expiry Warning";
                    const message = `Your employment contract is set to expire in ${diffDays} days (${expiry.toLocaleDateString()}). Please contact HR.`;

                    await createDuplicateCheckedNotification(user._id, title, message, 'contract');
                }
            }
        }

        if (res) res.status(200).json({ success: true, msg: "Scheduled alerts processed" });
    } catch (error) {
        console.error("Alert service error:", error);
        if (res) res.status(500).json({ success: false, msg: error.message });
    }
};

// Helper to avoid spamming the same notification on every login/check
const createDuplicateCheckedNotification = async (recipientId, title, message, type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Notification.findOne({
        recipient: recipientId,
        type: type,
        createdAt: { $gte: today }
    });

    if (!existing) {
        await Notification.create({
            recipient: recipientId,
            title,
            message,
            type
        });
    }
};
