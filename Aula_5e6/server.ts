import express from "express";

const app = express();
const PORT = 3000;

// Rota de integridade do sistema
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Servidor do Gestor de Tarefas ativo!" });
});

// Desafio
app.get("/api/version", (req, res) => {
    res.json({ appName: "Gestor de Tarefas", version: "1.0.0" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});