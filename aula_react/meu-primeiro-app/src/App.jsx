
import { useState } from "react";
import Tarefa from "./Tarefa.jsx";

function App() {
    const [tarefas, setTarefas] = useState([]);
    const [novoTitulo, setNovoTitulo] = useState("");

    function adicionarTarefa(evento) {
        evento.preventDefault();

        const tituloLimpo = novoTitulo.trim();

        if (tituloLimpo === "") {
            return;
        }

        const novaTarefa = {
            id: Date.now(),
            titulo: tituloLimpo,
            concluida: false
        };

        setTarefas(listaAtual => [...listaAtual, novaTarefa]);
        setNovoTitulo("");
    }

    function alterarTarefa(id) {
        setTarefas(
            listaAtual => listaAtual.map(
                tarefa => tarefa.id === id
                    ? { ...tarefa, concluida: !tarefa.concluida }
                    : tarefa
            )
        );
    }

    function removerTarefa(id) {
        setTarefas(
            listaAtual => listaAtual.filter(
                tarefa => tarefa.id !== id
            )
        );
    }

    const totalPendentes = tarefas.filter(
        tarefa => !tarefa.concluida
    ).length;

    return (
        <main>
            <h1>Lista de Tarefas</h1>
            <p>Organize suas tarefas</p>

            <form onSubmit={adicionarTarefa}>
                <label htmlFor="tituloTarefa">
                    Nova Tarefa:
                </label>

                <input
                    id="tituloTarefa"
                    type="text"
                    value={novoTitulo}
                    onChange={(evento) =>
                        setNovoTitulo(evento.target.value)
                    }
                    placeholder="Ex.: Estudar React"
                />

                <button type="submit">
                    Adicionar
                </button>
            </form>

            <ul>
                {tarefas.map((tarefa) => (
                    <Tarefa
                        key={tarefa.id}
                        tarefa={tarefa}
                        onAlterar={alterarTarefa}
                        onRemover={removerTarefa}
                    />
                ))}
            </ul>

            <p>Total de tarefas: {tarefas.length}</p>
            <p>Total de tarefas pendentes: {totalPendentes === 0 ? 'Sem tarefas Pendentes' : totalPendentes}</p>

        </main>
    );
}

export default App;
