import express from "express";

const app = express();
const PORT = 3000;

// Middleware para ler JSON
app.use(express.json());

// Banco de dados provisório em memória RAM
let bancoDeDadosProvisorio = [
    {
        id: 1,
        title: "Estudar Arquitetura REST no Módulo 2",
        status: "pending"
    }
];

// Rota de integridade do sistema
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Servidor do Gestor de Tarefas ativo!"
    });
});

// Rota de versão da aplicação
app.get("/api/version", (req, res) => {
    res.json({
        appName: "Gestor de Tarefas",
        version: "1.0.0"
    });
});

// Rota REST para listar todas as tarefas
app.get("/api/tasks", (req, res) => {
    res.json(bancoDeDadosProvisorio);
});

// Rota REST para criar uma nova tarefa
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;

    const novaTarefa = {
        id: Date.now(),
        title,
        status: "pending"
    };

    bancoDeDadosProvisorio.push(novaTarefa);

    res.status(201).json(novaTarefa);
});

// Rota REST para deletar uma tarefa
app.delete("/api/tasks/:id", (req, res) => {

    // 1. Pega o ID enviado pela URL
    const idParaDeletar = parseInt(req.params.id);

    // 2. Verifica se a tarefa existe no banco provisório
    const tarefaExiste = bancoDeDadosProvisorio.some(
        (t) => t.id === idParaDeletar
    );

    // 3. Se não existir, retorna erro 404
    if (!tarefaExiste) {
        return res.status(404).json({
            message: "Tarefa não encontrada!"
        });
    }

    // 4. Se existir, remove a tarefa do array
    bancoDeDadosProvisorio = bancoDeDadosProvisorio.filter(
        (t) => t.id !== idParaDeletar
    );

    // 5. Retorna mensagem de sucesso
    res.json({
        message: "Tarefa removida com sucesso da memória!"
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});