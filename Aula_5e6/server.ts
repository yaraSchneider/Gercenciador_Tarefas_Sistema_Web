import express from "express";
import Database from "better-sqlite3";

const app = express();
const PORT = 3000;

// Middleware para ler JSON
app.use(express.json());

const db = new Database("tarefas.db");

db.exec(` 
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        prioridade TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senha TEXT NOT NULL,
        email TEXT NOT NULL
    );
`);

const usuariosExistentes = db.prepare("SELECT COUNT(*) AS count FROM usuarios").get() as any;
if (usuariosExistentes.count === 0) {

db.prepare( "INSERT INTO usuarios (senha, email) VALUES ('admin123', 'admin@exemplo.com')").run();
}

console.log("Banco de dados inicializado com sucesso!");

app.get("/api/tasks", (req, res) => {
    const { search } = req.query;
    try {
    if (search) {
        // Prepared Statement: O '?' protege contra Injeção de SQL.
        const sql = "SELECT * FROM tarefas WHERE titulo LIKE ?";
        const tarefas = db.prepare(sql).all(`%${search}%`);
        res.json(tarefas);
    } else {
            const tarefas = db.prepare("SELECT * FROM tarefas").all();
            res.json(tarefas);
        }
    } catch (erro) {
        // Exibir o erro real ajuda a compreender a quebra de sintaxe gerada pelo ataque
        res.status(500).json({ error: erro instanceof Error ? erro.message : "Erro desconhecido" });
    }
});

// Banco de dados provisório em memória RAM
let bancoDeDadosProvisorio = [
    {
        id: 1,
        titulo: "Estudar Arquitetura REST no Módulo 2",
        status: "pending"
    }
];

// // Rota de integridade do sistema
// app.get("/api/health", (req, res) => {
//     res.json({
//         status: "ok",
//         message: "Servidor do Gestor de Tarefas ativo!"
//     });
// });

// // Rota de versão da aplicação
// app.get("/api/version", (req, res) => {
//     res.json({
//         appName: "Gestor de Tarefas",
//         version: "1.0.0"
//     });
// });

// // Rota REST para listar todas as tarefas
// app.get("/api/tasks", (req, res) => {
//     res.json(bancoDeDadosProvisorio);
// });

app.post("/api/tasks", (req, res) => {
    const { title, prioridade } = req.body;
    const prioridadeValida = ['low', 'medium', 'high'].includes(prioridade) ? prioridade : 'medium';
    
    // Validação rígida: Título obrigatório, não vazio e com tamanho mínimo
    // Sanitizamos com .trim() ANTES de checar o length, aplicando a regra de negócio
    if (!title || title.trim().length < 3) {
        return res.status(400).json({ 
            error: "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos." 
        });
    }
    try {
        const sql = "INSERT INTO tarefas (titulo, status, prioridade) VALUES (?, 'pending', ?)";
        const resultado = db.prepare(sql).run(title.trim(), prioridadeValida);
        
        // Retorna o objeto recém-criado usando o ID gerado (lastInsertRowid).
        const novaTarefa = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(resultado.lastInsertRowid);
        return res.status(201).json(novaTarefa);
    } catch (erro) {
        return res.status(500).json({ error: "Erro ao processar persistência" });
    }
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