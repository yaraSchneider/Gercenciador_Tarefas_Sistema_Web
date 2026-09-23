import { Router } from "express";
import {
    atualizarTarefa,
    atualizarTarefaParcialmente,
    buscarTarefaPorId,
    buscarTarefas,
    criarTarefa,
    excluirTarefa,
    listarTarefas
} from "../controllers/taskController.js";

export const taskRoutes = Router();

taskRoutes.get("/search/:termo", buscarTarefas);
taskRoutes.get("/:id", buscarTarefaPorId);
taskRoutes.get("/", listarTarefas);
taskRoutes.post("/", criarTarefa);
taskRoutes.put("/:id", atualizarTarefa);
taskRoutes.patch("/:id", atualizarTarefaParcialmente);
taskRoutes.delete("/:id", excluirTarefa);