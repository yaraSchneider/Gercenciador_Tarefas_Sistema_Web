import { db } from "../database/database.js";
import type { Tarefa } from "../types/task.js";

const stmtListarTarefas = db.prepare(
    "SELECT * FROM tarefas ORDER BY id DESC"
);

const stmtBuscarTarefaPorId = db.prepare(
    "SELECT * FROM tarefas WHERE id = ?"
);

const stmtCriarTarefa = db.prepare(`
    INSERT INTO tarefas (titulo, prioridade, status)
    VALUES (?, ?, ?)
`);

const stmtAtualizarTarefa = db.prepare(`
    UPDATE tarefas
    SET titulo = ?, prioridade = ?, status = ?
    WHERE id = ?
`);

const stmtExcluirTarefa = db.prepare(
    "DELETE FROM tarefas WHERE id = ?"
);

export const taskRepository = {
    listar(): Tarefa[] {
        return stmtListarTarefas.all() as Tarefa[];
    },

    buscarPorId(id: number): Tarefa | undefined {
        return stmtBuscarTarefaPorId.get(id) as Tarefa | undefined;
    },

    buscarPorTitulo(termo: string): Tarefa[] {
        return db
            .prepare(`
                SELECT *
                FROM tarefas
                WHERE titulo LIKE ?
                ORDER BY id DESC
            `)
            .all(`%${termo}%`) as Tarefa[];
    },

    criar(titulo: string, prioridade: string, status: string): Tarefa {
        const resultado = stmtCriarTarefa.run(titulo, prioridade, status);
        return this.buscarPorId(Number(resultado.lastInsertRowid)) as Tarefa;
    },

    atualizar(
        id: number,
        titulo: string,
        prioridade: string,
        status: string
    ): Tarefa {
        stmtAtualizarTarefa.run(titulo, prioridade, status, id);
        return this.buscarPorId(id) as Tarefa;
    },

    excluir(id: number): void {
        stmtExcluirTarefa.run(id);
    }
};