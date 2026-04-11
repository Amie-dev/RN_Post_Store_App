import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SEC, {
    expiresIn: "15d",
  });
};

const sendAuthResponse = (res, user, message, statusCode = 200) => {
  const token = generateToken(user._id);

  // 🍪 Set cookie (for web)
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // ⚠️ true in production (HTTPS)
    sameSite: "lax",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  // 📱 Send JSON (for mobile)
  return res.status(statusCode).json({
    success: true,
    message,
    token, // mobile will use this
    data: {
      _id: user._id,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
    },
  });
};

export class AuthController {
  // ✅ REGISTER
  static async register(req, res) {
    try {
      const { email, username, password } = req.body;

      // Validation
      if (!email || !username || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      // Check existing user
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Profile image
      const profileImage = `https://i.pravatar.cc/150?img=${Math.floor(
        Math.random() * 100 + 1,
      )}`;

      // Create user
      const user = await User.create({
        email,
        username,
        password,
        profileImage,
      });

      // const token = generateToken(user._id);

      // return res.status(201).json({
      //   success: true,
      //   message: "User registered successfully",
      //   token,
      //   data: {
      //     _id: user._id,
      //     email: user.email,
      //     username: user.username,
      //     profileImage: user.profileImage,
      //   },
      // });

      return sendAuthResponse(res, user, "User registered successfully", 201);
    } catch (error) {
      console.log("Register Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  // ✅ LOGIN
  static async login(req, res) {
    try {
      const { email, username, password } = req.body;

      if ((!email && !username) || !password) {
        return res.status(400).json({
          success: false,
          message: "Email/Username and password are required",
        });
      }

      const query = email ? { email } : { username };
      const user = await User.findOne(query);

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // const token = generateToken(user._id);

      // return res.status(200).json({
      //   success: true,
      //   message: "Login successful",
      //   token,
      //   data: {
      //     _id: user._id,
      //     email: user.email,
      //     username: user.username,
      //     profileImage: user.profileImage,
      //   },
      // });

      return sendAuthResponse(res, user, "Login successful");
    } catch (error) {
      console.log("Login Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async me(req,res){
    const user=await req.user

    if(!user){
      console.log("unAuthorize");

    return res.status(401).json({
      success: false,
      message: "unAuthorize",
    });
    }

    
   return res.status(200).json({
    success: true,
    data: req.user,
  });
  }

  static async logout(req, res) {
  res.clearCookie("token");
req.user=''
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
}
