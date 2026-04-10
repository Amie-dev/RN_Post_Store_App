import { Router } from "express";
import { AuthController } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.get("/login", AuthController.login);



export default authRouter