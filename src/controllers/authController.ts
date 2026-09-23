import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { JWT_SECRET } from "../config/env.js";
import { userRepository } from "../repositories/userRepository.js";

export function registrarUsuario(req: Request, res: Response): void {
    const { email, senha } = req.body;

    if (typeof email !== "string" || typeof senha !== "string") {
        res.status(400).json({ error: "E-mail e senha são obrigatórios." });
        return;
    }

    if (senha.trim().length < 6) {
        res.status(400).json({
            error: "A senha deve ter ao menos 6 caracteres."
        });
        return;
    }

    try {
        const emailNormalizado = email.trim();
        const id = userRepository.criar(
            emailNormalizado,
            bcrypt.hashSync(senha, 10)
        );

        res.status(201).json({ id, email: emailNormalizado });
    } catch (error: any) {
        if (
            error?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
            error?.code === "SQLITE_CONSTRAINT"
        ) {
            res.status(409).json({ error: "E-mail já cadastrado." });
            return;
        }

        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

export function login(req: Request, res: Response): void {
    const { email, senha } = req.body;

    if (typeof email !== "string" || typeof senha !== "string") {
        res.status(400).json({ error: "E-mail e senha são obrigatórios." });
        return;
    }

    const usuario = userRepository.buscarPorEmail(email.trim());
    const fakeHash = "$2a$10$fakehashparanaquebrarcomparacao";
    const senhaValida = bcrypt.compareSync(senha, usuario?.senha || fakeHash);

    if (!usuario || !senhaValida) {
        res.status(401).json({ error: "Credenciais inválidas." });
        return;
    }

    res.json({
        token: jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: "2h" }
        )
    });
}