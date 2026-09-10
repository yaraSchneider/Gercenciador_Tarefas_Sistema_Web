# 📝 Anotações — API de Tarefas (Node + Express + SQLite)

## O que é esse código?

É um **servidor backend** que gerencia uma lista de tarefas (to-do list).
Ele fica "escutando" pedidos (requisições HTTP) e responde em **JSON**.

Tecnologias usadas:
- **Express** → framework para criar rotas/endpoints
- **TypeScript** → JavaScript com tipos (evita erros bobos)
- **better-sqlite3** → banco de dados local (arquivo `tarefas.db`)

---

## 🧱 Estrutura geral do arquivo

1. Tipos (o "formato" dos dados)
2. Funções de validação
3. Configuração do banco de dados
4. Consultas SQL prontas (prepared statements)
5. Rotas da API (GET, POST, PUT, PATCH, DELETE)
6. Início do servidor

---

## 1) Tipos

```ts
interface Tarefa {
    id: number;
    titulo: string;
    prioridade: Prioridade;
    status: Status;
}
```

- `Prioridade` só pode ser: `"low" | "medium" | "high"`
- `Status` só pode ser: `"pending" | "completed"`

> 💡 Isso é só para o TypeScript te avisar se você tentar usar um valor errado.

---

## 2) Funções de validação

| Função | Para que serve |
|---|---|
| `tituloValido()` | Confere se o título tem pelo menos 3 caracteres |
| `normalizarPrioridade()` | Se vier algo inválido, usa `"medium"` como padrão |
| `normalizarStatus()` | Se vier algo inválido, usa `"pending"` como padrão |
| `prioridadeValida()` | Diz se o valor está entre `low/medium/high` |
| `statusValido()` | Diz se o valor está entre `pending/completed` |
| `parsearId()` | Garante que o ID da URL é um número inteiro positivo |

> Essas funções existem para **nunca confiar** no que vem do usuário sem checar antes.

---

## 3) Banco de dados

Cria (se não existir) duas tabelas:

```
tarefas   → id, titulo, prioridade, status
usuarios  → id, senha, email
```

Se não existir nenhum usuário, cria um automático:
```
email: admin@exemplo.com
senha: admin123
```

> ⚠️ **Atenção:** a senha é salva sem criptografia (texto puro).
> Isso é **inseguro** para produção — só serve para estudo/teste.

---

## 4) Prepared Statements

São consultas SQL "pré-montadas", reutilizadas em várias rotas.
Vantagem: mais rápido e **protege contra SQL Injection**.

Exemplos: `stmtListarTodas`, `stmtInserirTarefa`, `stmtDeletarTarefa`, etc.

---

## 5) Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| `GET` | `/api/tasks` | Lista todas as tarefas (ou filtra com `?search=texto`) |
| `POST` | `/api/tasks` | Cria uma nova tarefa |
| `PUT` | `/api/tasks/:id` | Substitui a tarefa inteira (título, status, prioridade) |
| `PATCH` | `/api/tasks/:id` | Atualiza só os campos enviados |
| `DELETE` | `/api/tasks/:id` | Apaga uma tarefa pelo ID |
| `GET` | `/api/health` | Diz se o servidor está funcionando |
| `GET` | `/api/version` | Retorna a versão da API |

### Diferença entre PUT e PATCH
- **PUT** → você manda a tarefa "inteira" de novo (título obrigatório)
- **PATCH** → você manda só o que quer mudar (ex: só o status)

### Códigos de erro usados
- `400` → dado inválido (ex: título muito curto)
- `404` → tarefa não encontrada
- `500` → erro interno do servidor

---

## 6) Início do servidor

```ts
app.listen(PORT, () => { ... });
```

Liga o servidor na porta `3000`.
Depois disso, dá pra acessar em: `http://localhost:3000`

---

## 🔑 Resumo em 1 frase
> Um CRUD (Criar, Ler, Atualizar, Apagar) de tarefas, com validação
> cuidadosa dos dados e um banco SQLite local guardando tudo.

## ⚠️ Pontos de atenção para melhorar depois
- [ ] Criptografar a senha do usuário (ex: com `bcrypt`)
- [ ] Adicionar autenticação nas rotas (hoje qualquer um pode mexer)
- [ ] Adicionar testes automatizados