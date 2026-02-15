import User from "../models/user.js";
import Employee from "../models/employee.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function RegisterUser(req, res) {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                msg: "please add all fields"
            });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                msg: "user already exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hsashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hsashedPassword,
            role: role || "employee"
        })
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        } else {
            res.status(400).json({
                msg: "Invalid data"
            })
        }
    } catch (err) {
        res.status(400).json({
            msg: err.message
        });
    }
};

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const comparePassword = await bcrypt.compare(password, user.password);
        if (user && comparePassword) {
            // Find associated employee to get employeeID
            const employee = await Employee.findOne({ email: user.email });

            res.status(201).json({
                msg: "login successfull",
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                employeeID: employee ? employee.employeeID : null,
                token: genarateToken(user._id)
            })
        } else {
            res.status(400).json({
                msg: "invalid password or email"
            })
        }
    } catch (err) {
        res.status(400).json({
            msg: err.message
        });
    }
};

export async function getUser(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Find associated employee
        const employee = await Employee.findOne({ email: user.email });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeID: employee ? employee.employeeID : null
        })
    } catch (err) {
        res.status(400).json({
            msg: err.message
        });
    }
}

export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: "Current password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, msg: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ success: false, msg: err.message });
    }
}

function genarateToken(id) {
    return jwt.sign({ id }, "malindu123", {
        expiresIn: '30d',
    })
}