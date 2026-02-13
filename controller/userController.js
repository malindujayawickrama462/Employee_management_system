import User from "../models/user.js";
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
            res.status(201).json({
                msg: "login successfull",
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
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
        const { _id, name, email, role } = await User.findById(req.user.id)
        res.status(201).json({
            id: _id,
            name,
            email,
            role,
        })
    } catch (err) {
        res.status(400).json({
            msg: err.message
        });
    }
}

function genarateToken(id) {
    return jwt.sign({ id }, "malindu123", {
        expiresIn: '30d',
    })
}