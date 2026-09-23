import { Router } from "express";
import { authRoutes } from "./authRoutes.js";
import { taskRoutes } from "./taskRoutes.js";

export const routes = Router();

routes.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "API funcionando corretamente."
    });
});

routes.get("/version", (_req, res) => {
    res.json({ version: "1.0.0" });
});

routes.use("/tasks", taskRoutes);
routes.use("/auth", authRoutes);