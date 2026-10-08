import type { Request, Response } from "express";
import { taskRepository } from "../repositories/taskRepository.js";
import {
    prioridadesValidas,
    statusValidos,
    type Prioridade,
    type Status
} from "../types/task.js";

function validarDadosDaTarefa(
    titulo: unknown,
    prioridade: unknown,
    status: unknown
): string | null {
    if (typeof titulo !== "string" || titulo.trim() === "") {
        return "O título é obrigatório.";
    }

    if (!prioridadesValidas.includes(prioridade as Prioridade)) {
        return "Prioridade inválida. Use 'baixa', 'media' ou 'alta'.";
    }

    if (!statusValidos.includes(status as Status)) {
        return "Status inválido. Use 'pending', 'in_progress' ou 'completed'.";
    }

    return null;
}

function obterId(req: Request, res: Response): number | null {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).json({ error: "ID inválido." });
        return null;
    }

    return id;
}

export function listarTarefas(req: Request, res: Response): void {
    const { search } = req.query;

    if (search === undefined || search === "") {
        res.json(taskRepository.listar());
        return;
    }

    if (typeof search !== "string") {
        res.status(400).json({ error: "Parâmetro search inválido." });
        return;
    }

    res.json(taskRepository.buscarPorTitulo(search));
}

export function buscarTarefaPorId(req: Request, res: Response): void {
    const id = obterId(req, res);
    if (id === null) return;

    const tarefa = taskRepository.buscarPorId(id);
    if (!tarefa) {
        res.status(404).json({ error: "Tarefa não encontrada." });
        return;
    }

    res.json(tarefa);
}

export function criarTarefa(req: Request, res: Response): void {
    const { titulo, prioridade, status } = req.body;
    const erro = validarDadosDaTarefa(titulo, prioridade, status);

    if (erro) {
        res.status(400).json({ error: erro });
        return;
    }

    res.status(201).json(
        taskRepository.criar(titulo.trim(), prioridade, status)
    );
}

export function atualizarTarefa(req: Request, res: Response): void {
    const id = obterId(req, res);
    if (id === null) return;

    if (!taskRepository.buscarPorId(id)) {
        res.status(404).json({ error: "Tarefa não encontrada." });
        return;
    }

    const { titulo, prioridade, status } = req.body;
    const erro = validarDadosDaTarefa(titulo, prioridade, status);

    if (erro) {
        res.status(400).json({ error: erro });
        return;
    }

    res.json(taskRepository.atualizar(id, titulo.trim(), prioridade, status));
}

export function atualizarTarefaParcialmente(
    req: Request,
    res: Response
): void {
    const id = obterId(req, res);
    if (id === null) return;

    const tarefaExistente = taskRepository.buscarPorId(id);
    if (!tarefaExistente) {
        res.status(404).json({ error: "Tarefa não encontrada." });
        return;
    }

    const titulo = req.body.titulo !== undefined
        ? req.body.titulo
        : tarefaExistente.titulo;
    const prioridade = req.body.prioridade !== undefined
        ? req.body.prioridade
        : tarefaExistente.prioridade;
    const status = req.body.status !== undefined
        ? req.body.status
        : tarefaExistente.status;
    const erro = validarDadosDaTarefa(titulo, prioridade, status);

    if (erro) {
        res.status(400).json({ error: erro });
        return;
    }

    res.json(taskRepository.atualizar(id, titulo.trim(), prioridade, status));
}

export function excluirTarefa(req: Request, res: Response): void {
    const id = obterId(req, res);
    if (id === null) return;

    if (!taskRepository.buscarPorId(id)) {
        res.status(404).json({ error: "Tarefa não encontrada." });
        return;
    }

    taskRepository.excluir(id);
    res.status(204).send();
}

export function buscarTarefas(req: Request, res: Response): void {
    const termo = Array.isArray(req.params.termo)
        ? req.params.termo[0]
        : req.params.termo;

    res.json(taskRepository.buscarPorTitulo(termo));
}