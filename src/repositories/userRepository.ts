import { db } from "../database/database.js";
import type { Usuario } from "../types/user.js";

const stmtBuscarUsuarioPorEmail = db.prepare(
    "SELECT * FROM usuarios WHERE email = ?"
);

const stmtInserirUsuario = db.prepare(
    "INSERT INTO usuarios (email, senha) VALUES (?, ?)"
);

export const userRepository = {
    buscarPorEmail(email: string): Usuario | undefined {
        return stmtBuscarUsuarioPorEmail.get(email) as Usuario | undefined;
    },

    criar(email: string, senha: string): number {
        const resultado = stmtInserirUsuario.run(email, senha);
        return Number(resultado.lastInsertRowid);
    }
};