export interface Tarefa {
    id: number;
    titulo: string;
    prioridade: Prioridade;
    status: Status;
}

export type Prioridade = "baixa" | "media" | "alta";

export type Status = "pending" | "in_progress" | "completed";

export const prioridadesValidas: Prioridade[] = [
    "baixa",
    "media",
    "alta"
];

export const statusValidos: Status[] = [
    "pending",
    "in_progress",
    "completed"
];