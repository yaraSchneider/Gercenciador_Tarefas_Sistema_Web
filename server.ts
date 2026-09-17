import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// ============================================================
// TIPOS
// ============================================================

interface Tarefa {
    id: number;
    titulo: string;
    prioridade: Prioridade;
    status: Status;
}

type Prioridade = "low" | "medium" | "high";
type Status = "pending" | "completed";

interface CorpoTarefa {
    title?: unknown;
    prioridade?: unknown;
    status?: unknown;
}

interface ContagemUsuarios {
    count: number;
}

// ============================================================
// CONSTANTES E HELPERS DE VALIDAÇÃO
// ============================================================

const PRIORIDADES = ["low", "medium", "high"] as const;
const STATUS_VALIDOS = ["pending", "completed"] as const;

function tituloValido(title: unknown): title is string {
    return typeof title === "string" && title.trim().length >= 3;
}

function normalizarPrioridade(valor: unknown): Prioridade {
    if (
        typeof valor === "string" &&
        (PRIORIDADES as readonly string[]).includes(valor)
    ) {
        return valor as Prioridade;
    }
    return "medium";
}

function normalizarStatus(valor: unknown): Status {
    if (
        typeof valor === "string" &&
        (STATUS_VALIDOS as readonly string[]).includes(valor)
    ) {
        return valor as Status;
    }
    return "pending";
}

function prioridadeValida(valor: unknown): valor is Prioridade {
    return (
        typeof valor === "string" &&
        (PRIORIDADES as readonly string[]).includes(valor)
    );
}

function statusValido(valor: unknown): valor is Status {
    return (
        typeof valor === "string" &&
        (STATUS_VALIDOS as readonly string[]).includes(valor)
    );
}

function parsearId(valor: unknown): number | null {
    if (typeof valor !== "string" || !/^\d+$/.test(valor)) {
        return null;
    }

    const id = Number(valor);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

// ============================================================
// BANCO DE DADOS
// ============================================================

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

// ============================================================
// PREPARED STATEMENTS REUTILIZÁVEIS
// ============================================================

const stmtContarUsuarios = db.prepare(
    "SELECT COUNT(*) AS count FROM usuarios"
);

const stmtInserirUsuario = db.prepare(
    "INSERT INTO usuarios (senha, email) VALUES (?, ?)"
);

const stmtListarTodas = db.prepare(`
    SELECT id, titulo, prioridade, status
    FROM tarefas
    ORDER BY id ASC
`);

const stmtBuscarPorTitulo = db.prepare(`
    SELECT id, titulo, prioridade, status
    FROM tarefas
    WHERE titulo LIKE ?
    ORDER BY id ASC
`);

const stmtBuscarPorId = db.prepare(`
    SELECT id, titulo, prioridade, status
    FROM tarefas
    WHERE id = ?
`);

const stmtInserirTarefa = db.prepare(`
    INSERT INTO tarefas (titulo, status, prioridade)
    VALUES (?, ?, ?)
`);

const stmtDeletarTarefa = db.prepare(
    "DELETE FROM tarefas WHERE id = ?"
);

const usuariosExistentes =
    stmtContarUsuarios.get() as ContagemUsuarios;

if (usuariosExistentes.count === 0) {
    stmtInserirUsuario.run("admin123", "admin@exemplo.com");
}

console.log("Banco de dados inicializado com sucesso!");

// ============================================================
// GET /api/tasks
// ============================================================

app.get("/api/tasks", (req: Request, res: Response) => {
    const search = req.query.search;

    try {
        if (search !== undefined) {
            if (typeof search !== "string") {
                return res.status(400).json({
                    error: "O parâmetro search deve ser um texto."
                });
            }

            const tarefas =
                stmtBuscarPorTitulo.all(`%${search}%`) as Tarefa[];

            return res.status(200).json(tarefas);
        }

        const tarefas = stmtListarTodas.all() as Tarefa[];
        return res.status(200).json(tarefas);
    } catch (erro: unknown) {
        console.error("Erro ao listar tarefas:", erro);

        return res.status(500).json({
            error: "Erro interno ao consultar as tarefas."
        });
    }
});

// ============================================================
// POST /api/tasks
// ============================================================

app.post("/api/tasks", (req: Request, res: Response) => {
    const body = (req.body ?? {}) as CorpoTarefa;
    const { title, prioridade } = body;

    if (!tituloValido(title)) {
        return res.status(400).json({
            error:
                "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos."
        });
    }

    const prioridadeValidaFinal =
        normalizarPrioridade(prioridade);

    try {
        const resultado = stmtInserirTarefa.run(
            title.trim(),
            "pending",
            prioridadeValidaFinal
        );

        const novaTarefa = stmtBuscarPorId.get(
            resultado.lastInsertRowid
        ) as Tarefa | undefined;

        if (!novaTarefa) {
            return res.status(500).json({
                error:
                    "A tarefa foi criada, mas não pôde ser recuperada."
            });
        }

        return res.status(201).json(novaTarefa);
    } catch (erro: unknown) {
        console.error("Erro ao inserir tarefa:", erro);

        return res.status(500).json({
            error: "Erro interno ao criar a tarefa."
        });
    }
});

// ============================================================
// DELETE /api/tasks/:id
// ============================================================

app.delete("/api/tasks/:id", (req: Request, res: Response) => {
    const idParaDeletar = parsearId(req.params.id);

    if (idParaDeletar === null) {
        return res.status(400).json({
            error: "ID inválido."
        });
    }

    try {
        const resultado =
            stmtDeletarTarefa.run(idParaDeletar);

        if (resultado.changes === 0) {
            return res.status(404).json({
                error: "Tarefa não localizada para exclusão."
            });
        }

        return res.status(200).json({
            message:
                "Tarefa excluída do banco SQLite com sucesso!"
        });
    } catch (erro: unknown) {
        console.error("Erro ao excluir tarefa:", erro);

        return res.status(500).json({
            error: "Erro interno ao processar a exclusão."
        });
    }
});

// ============================================================
// PUT /api/tasks/:id
// ============================================================

app.put("/api/tasks/:id", (req: Request, res: Response) => {
    const idParaAtualizar =
        parsearId(req.params.id);

    if (idParaAtualizar === null) {
        return res.status(400).json({
            error: "ID inválido."
        });
    }

    const body = (req.body ?? {}) as CorpoTarefa;
    const { title, prioridade, status } = body;

    if (!tituloValido(title)) {
        return res.status(400).json({
            error:
                "O título da tarefa é obrigatório e deve conter pelo menos 3 caracteres válidos."
        });
    }

    if (
        prioridade !== undefined &&
        !prioridadeValida(prioridade)
    ) {
        return res.status(400).json({
            error:
                "Prioridade inválida. Use 'low', 'medium' ou 'high'."
        });
    }

    if (
        status !== undefined &&
        !statusValido(status)
    ) {
        return res.status(400).json({
            error:
                "Status inválido. Use 'pending' ou 'completed'."
        });
    }

    const prioridadeValidaFinal =
        normalizarPrioridade(prioridade);

    const statusValidoFinal =
        normalizarStatus(status);

    try {
        // UPDATE completo criado inline, com placeholders seguros.
        const sql =
            "UPDATE tarefas SET titulo = ?, status = ?, prioridade = ? WHERE id = ?";

        const resultado = db.prepare(sql).run(
            title.trim(),
            statusValidoFinal,
            prioridadeValidaFinal,
            idParaAtualizar
        );

        if (resultado.changes === 0) {
            const existente = stmtBuscarPorId.get(
                idParaAtualizar
            ) as Tarefa | undefined;

            if (!existente) {
                return res.status(404).json({
                    error:
                        "Tarefa não encontrada para atualização!"
                });
            }
        }

        const tarefaAtualizada =
            stmtBuscarPorId.get(idParaAtualizar) as
            | Tarefa
            | undefined;

        return res.status(200).json(tarefaAtualizada);
    } catch (erro: unknown) {
        console.error("Erro ao atualizar tarefa:", erro);

        return res.status(500).json({
            error:
                "Erro ao processar a atualização no banco de dados."
        });
    }
});

// ============================================================
// PATCH /api/tasks/:id
// ============================================================

app.patch("/api/tasks/:id", (req: Request, res: Response) => {
    const idParaAtualizar =
        parsearId(req.params.id);

    if (idParaAtualizar === null) {
        return res.status(400).json({
            error: "ID inválido."
        });
    }

    const body = (req.body ?? {}) as CorpoTarefa;

    if (Object.keys(body).length === 0) {
        return res.status(400).json({
            error:
                "Nenhum campo fornecido para atualização."
        });
    }

    const { title, prioridade, status } = body;

    try {
        const fluxoAtualizacao =
            db.transaction(() => {
                const tarefaExistente =
                    stmtBuscarPorId.get(
                        idParaAtualizar
                    ) as Tarefa | undefined;

                if (!tarefaExistente) {
                    return null;
                }

                const camposParaAtualizar: string[] = [];
                const valoresParaAtualizar:
                    Array<string | number> = [];

                if (title !== undefined) {
                    if (!tituloValido(title)) {
                        throw new Error("TITLE_INVALID");
                    }

                    camposParaAtualizar.push("titulo = ?");
                    valoresParaAtualizar.push(title.trim());
                }

                if (prioridade !== undefined) {
                    if (!prioridadeValida(prioridade)) {
                        throw new Error("PRIORITY_INVALID");
                    }

                    camposParaAtualizar.push("prioridade = ?");
                    valoresParaAtualizar.push(prioridade);
                }

                if (status !== undefined) {
                    if (!statusValido(status)) {
                        throw new Error("STATUS_INVALID");
                    }

                    camposParaAtualizar.push("status = ?");
                    valoresParaAtualizar.push(status);
                }

                if (camposParaAtualizar.length === 0) {
                    return tarefaExistente;
                }

                // Somente colunas controladas pelo servidor entram na SQL.
                // Os valores do usuário usam exclusivamente placeholders.
                const sql = `
                    UPDATE tarefas
                    SET ${camposParaAtualizar.join(", ")}
                    WHERE id = ?
                `;

                valoresParaAtualizar.push(idParaAtualizar);

                db.prepare(sql).run(
                    ...valoresParaAtualizar
                );

                return stmtBuscarPorId.get(
                    idParaAtualizar
                ) as Tarefa;
            });

        const resultado = fluxoAtualizacao();

        if (!resultado) {
            return res.status(404).json({
                error:
                    "Tarefa não encontrada para atualização parcial!"
            });
        }

        return res.status(200).json(resultado);
    } catch (erro: unknown) {
        if (erro instanceof Error) {
            if (erro.message === "TITLE_INVALID") {
                return res.status(400).json({
                    error:
                        "O título da tarefa deve conter pelo menos 3 caracteres válidos."
                });
            }

            if (erro.message === "PRIORITY_INVALID") {
                return res.status(400).json({
                    error:
                        "Prioridade inválida. Use 'low', 'medium' ou 'high'."
                });
            }

            if (erro.message === "STATUS_INVALID") {
                return res.status(400).json({
                    error:
                        "Status inválido. Use 'pending' ou 'completed'."
                });
            }
        }

        console.error(
            "Erro ao atualizar parcialmente:",
            erro
        );

        return res.status(500).json({
            error:
                "Erro interno ao processar a atualização parcial."
        });
    }
});

// ============================================================
// GET /api/health
// ============================================================

app.get("/api/health", (_req: Request, res: Response) => {
    return res.status(200).json({
        status: "ok",
        message: "API funcionando corretamente."
    });
});

// ============================================================
// GET /api/version
// ============================================================

app.get("/api/version", (_req: Request, res: Response) => {
    return res.status(200).json({
        version: "1.0.0"
    });
});

// ============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================

app.listen(PORT, () => {
    console.log(
        `Servidor rodando em: http://localhost:${PORT}`
    );
});
