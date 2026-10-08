import { useEffect, useState } from 'react';
import './App.css';
import { listarTarefas, type Tarefa } from './api';

function Saudacao() {
  return <h1>Olá, turma! Minha primeira interface!</h1>;
}

export default function App() {
  const [n, setN] = useState(0);
  const [statusServidor, setStatusServidor] = useState('Carregando...');
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    { id: 1, titulo: 'Configurar Vite e React', prioridade: 'alta', status: 'pending' },
    { id: 2, titulo: 'Entender useState e useEffect', prioridade: 'media', status: 'in_progress' },
    { id: 3, titulo: 'Renderizar lista com map()', prioridade: 'baixa', status: 'completed' },
  ]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const verificarConexao = async () => {
      try {
        const resposta = await fetch('http://localhost:3000/api/health');

        if (!resposta.ok) {
          throw new Error('Resposta inválida do servidor');
        }

        const dados = await resposta.json();
        console.log('Dados da API:', dados);
        setStatusServidor('Conexão estabelecida com sucesso!');
      } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        setStatusServidor('Erro ao conectar com o servidor');
      }
    };

    void verificarConexao();
  }, []);

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const tarefasCarregadas = await listarTarefas();

        if (tarefasCarregadas.length > 0) {
          setTarefas(tarefasCarregadas);
        }

        console.log('Tarefas carregadas:', tarefasCarregadas);
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : 'Erro ao carregar as tarefas.';
        setErro(mensagem);
      }
    };

    void carregarTarefas();
  }, []);

  return (
    <main className="app-shell">
      <Saudacao />

      <section className="painel">
        <h2>Contador interativo</h2>
        <button type="button" onClick={() => setN((valor) => valor + 1)}>
          Cliquei {n} vezes
        </button>
      </section>

      <section className="painel">
        <h2>Status do Servidor</h2>
        <p>{statusServidor}</p>
      </section>

      <section className="painel">
        <h2>Minhas Tarefas</h2>
        {erro ? (
          <p className="erro">{erro}</p>
        ) : (
          <ul className="lista-tarefas">
            {tarefas.map((tarefa) => (
              <li key={tarefa.id}>{tarefa.titulo}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
