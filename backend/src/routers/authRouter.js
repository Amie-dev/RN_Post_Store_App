import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

authRouter.get("/me", authMiddleware, AuthController.me);

authRouter.get("/logout", authMiddleware, AuthController.logout);
export default authRouter;
