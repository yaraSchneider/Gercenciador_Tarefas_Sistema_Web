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
    const responseBody = await res.text();
    let message = `Erro HTTP ${res.status}.`;

    if (responseBody) {
      try {
        const errorData: unknown = JSON.parse(responseBody);
        if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'error' in errorData &&
          typeof errorData.error === 'string'
        ) {
          message = errorData.error;
        } else {
          message = responseBody;
        }
      } catch {
        message = responseBody;
      }
    }

    throw new Error(message);
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
