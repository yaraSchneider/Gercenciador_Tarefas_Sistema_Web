# Diário de Classe - Organização do Backend

## O que foi alterado

Antes, todo o backend estava dentro de um único arquivo chamado `server.ts`.
Esse arquivo tinha muitas responsabilidades ao mesmo tempo: criava o servidor,
configurava o banco, definia os tipos, escrevia as consultas SQL e também
implementava todas as rotas da API.

Para deixar o projeto mais organizado, separei o código em pastas. Assim, cada
arquivo cuida de uma parte específica do sistema.

## Nova estrutura

```text
src/
├── app.ts
├── server.ts
├── config/
├── database/
├── types/
├── repositories/
├── controllers/
└── routes/
```

### `app.ts` e `server.ts`

- `app.ts` configura o Express e registra os middlewares e as rotas.
- `server.ts` apenas inicia o servidor na porta 3000.

Essa separação facilita os testes e deixa claro qual arquivo é responsável por
ligar a aplicação.

### `config/`

Guarda configurações da aplicação, como a porta do servidor e a chave usada pelo
JWT.

### `database/`

É responsável por abrir o banco SQLite e criar as tabelas `tarefas` e
`usuarios` quando elas ainda não existem.

### `types/`

Contém os tipos do TypeScript, como `Tarefa`, `Usuario`, `Prioridade` e
`Status`. Também ficam nessa parte os valores válidos de prioridade e status.

### `repositories/`

Os repositórios cuidam do acesso ao banco de dados. Por exemplo, o
`taskRepository` lista, cria, atualiza, busca e exclui tarefas.

Com isso, as consultas SQL não ficam misturadas com as regras das rotas.

### `controllers/`

Os controladores recebem as requisições e aplicam as regras da aplicação.

O `taskController` valida os dados das tarefas e chama o repositório correto.
O `authController` cuida do cadastro, do login, do hash da senha com bcrypt e da
criação do token JWT.

### `routes/`

As rotas fazem o relacionamento entre o endereço da API e o controlador que
deve ser executado.

Por exemplo:

```text
/api/tasks  -> rotas de tarefas
/api/auth   -> rotas de autenticação
```

As rotas ficaram menores porque não precisam mais conter toda a lógica do
sistema.

## Por que essa organização é melhor?

Separar o código por responsabilidade traz algumas vantagens práticas:

- fica mais fácil encontrar uma parte específica do sistema;
- alterações no banco não precisam ser feitas dentro das rotas;
- os arquivos ficam menores e mais fáceis de entender;
- novos recursos podem ser adicionados sem deixar um arquivo gigante;
- o código fica mais preparado para testes e manutenção.

Essa organização é conhecida como separação de responsabilidades. Cada parte
faz o seu trabalho e se comunica com as outras partes de forma organizada.

## O que foi mantido funcionando

As rotas existentes continuaram disponíveis:

- `GET /api/health` verifica se a API está funcionando;
- `GET /api/version` mostra a versão da API;
- `GET`, `POST`, `PUT`, `PATCH` e `DELETE` em `/api/tasks` gerenciam tarefas;
- `POST /api/auth/register` cadastra usuários;
- `POST /api/auth/login` realiza o login.

Também mantive as validações de título, prioridade, status e ID. As consultas
continuam usando parâmetros do SQLite, evitando montar comandos SQL diretamente
com dados enviados pelo usuário.

## Como executar depois da mudança

Para iniciar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

Para iniciar normalmente:

```bash
npm start
```

Para verificar se o TypeScript está correto:

```bash
npm run build
```

## Conclusão

A principal mudança foi tirar todas as responsabilidades de dentro do
`server.ts` e distribuí-las em arquivos menores. O sistema continua fazendo as
mesmas operações, mas agora está mais fácil de ler, corrigir e aumentar.

Aprendi que organizar um projeto não significa apenas criar mais pastas. O
importante é separar cada responsabilidade no lugar certo, mantendo o código
mais simples para quem precisar trabalhar nele depois.
