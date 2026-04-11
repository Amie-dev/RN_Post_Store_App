import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // ✅ 1. Check Bearer token (mobile)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ 2. Check cookie (web)
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const user=await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("Auth Middleware Error:", );

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    }

    // ✅ Attach user
    req.user = user

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
