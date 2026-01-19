import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) 
        {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token is missing
    if (!token) {
      return res.status(401).json({
        msg: "Not authorized, no token provided"
      });
    }

    const decoded = jwt.verify(token,"malindu123");

   
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        msg: "User not found"
      });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      msg: "Not authorized",
      error: err.message
    });
  }
};
