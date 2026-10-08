export interface Tarefa {
  id: number;
  titulo: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pending' | 'in_progress' | 'completed';
}

export function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}

export async function tratarResposta<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = (await res.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(errorData?.error ?? 'Erro ao processar a requisição.');
  }

  return (await res.json()) as T;
}

export const listarTarefas = async (search = ''): Promise<Tarefa[]> => {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const resposta = await fetch(`http://localhost:3000/api/tasks${query}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  return tratarResposta<Tarefa[]>(resposta);
};
