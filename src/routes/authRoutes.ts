import { Router } from "express";
import { login, registrarUsuario } from "../controllers/authController.js";

export const authRoutes = Router();

authRoutes.post("/register", registrarUsuario);
authRoutes.post("/login", login);