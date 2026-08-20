# Gerenciador de Tarefas - Sistema Web

## Visão Geral

Este projeto é um sistema web de gerenciamento de tarefas desenvolvido para praticar a criação de interfaces responsivas e a implementação de uma API REST com Node.js e Express.

A estrutura atual combina:

- front-end em HTML com Tailwind CSS
- backend em TypeScript
- API REST com Express para manipular tarefas
- persistência de tarefas em banco de dados SQLite
- validação de dados e consultas parametrizadas
- ambiente de desenvolvimento configurado com scripts para rodar e testar a aplicação

## Autora

- Yara Schneider

## Objetivo

Criar um gerenciador de tarefas funcional, com foco em:

- organização visual da interface
- cadastro e listagem de atividades
- estrutura inicial de API para integração com o front-end
- prática de desenvolvimento de sistemas web com rotas e manipulação de dados

## Status Atual do Projeto

As atualizações implementadas no commit mais recente incluem:

- criação do servidor Express em TypeScript
- configuração do projeto com scripts de desenvolvimento e build
- criação automática do banco `tarefas.db` e das tabelas `tarefas` e `usuarios`
- inserção de tarefas no SQLite por meio da rota `POST /api/tasks`
- validação do título, que é obrigatório e deve conter pelo menos 3 caracteres após a remoção de espaços
- suporte às prioridades `low`, `medium` e `high`, usando `medium` quando uma prioridade inválida não é informada
- busca de tarefas pelo parâmetro `search` com prepared statement
- exemplos de sucesso e de validação no arquivo `Aula_5e6/request.http`

## Tecnologias Utilizadas

- HTML5
- Tailwind CSS
- JavaScript/TypeScript
- Node.js
- Express
- TSX

## Estrutura do Projeto

```text
Gercenciador_Tarefas_Sistema_Web/
├── index.html                  # Interface principal do sistema
├── package.json                # Scripts e dependências do projeto
├── tailwind.config.js          # Configuração do Tailwind CSS
├── README.md                   # Documentação do projeto
├── tarefas.db                  # Banco de dados SQLite
├── Dicas e Truques.txt         # Anotações auxiliares
├── desafio_Aulas_3e4/          # Arquivos das aulas 3 e 4
│   └── Desafio_3e4.html
├── Aula_5e6/
│   ├── server.ts               # Servidor Express da aplicação
│   ├── request.http            # Exemplos de requisições HTTP
│   └── tsconfig.json           # Configuração do TypeScript
└── node_modules/               # Dependências instaladas
```

## Como Executar o Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor em modo de desenvolvimento

```bash
npm run dev
```

Esse comando utiliza o `tsx watch` para observar alterações no arquivo `Aula_5e6/server.ts` e reiniciar automaticamente o servidor.

### 3. Rodar diretamente sem watch

```bash
npm run start
```

### 4. Compilar o projeto TypeScript

```bash
npm run build
```

## API REST Disponível

O servidor está rodando em:

```text
http://localhost:3000
```

### Rotas implementadas

#### Listar tarefas

```http
GET /api/tasks
```

Também é possível filtrar pelo título:

```http
GET /api/tasks?search=sqlite
```

#### Criar tarefa

```http
POST /api/tasks
Content-Type: application/json
```

Body de exemplo:

```json
{
  "title": "Estudar Node.js no Módulo 2",
  "prioridade": "high"
}
```

O campo `title` é obrigatório e precisa ter pelo menos 3 caracteres válidos. A rota retorna `400` quando essa regra não é atendida e `201` quando a tarefa é criada com sucesso. A prioridade aceita os valores `low`, `medium` e `high`.

#### Remover tarefa

```http
DELETE /api/tasks/:id
```

## Banco de Dados Atual

O projeto usa o SQLite por meio da biblioteca `better-sqlite3`. Ao iniciar o servidor, o arquivo `tarefas.db` é aberto e as tabelas são criadas automaticamente caso ainda não existam.

As tarefas persistidas possuem os campos `id`, `titulo`, `prioridade` e `status`. A tabela `usuarios` também é criada e recebe um usuário inicial para os exemplos de consulta.

Exemplo de estrutura:

```text
 tarefas
 ├── id          INTEGER PRIMARY KEY AUTOINCREMENT
 ├── titulo      TEXT NOT NULL
 ├── prioridade  TEXT DEFAULT 'medium'
 └── status      TEXT DEFAULT 'pending'
```

## Como Testar as Rotas

O arquivo `Aula_5e6/request.http` contém exemplos prontos para uso com clientes HTTP como VS Code REST Client ou ferramentas similares.

Exemplos:

```http
GET http://localhost:3000/api/tasks
GET http://localhost:3000/api/tasks?search=SQLite
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Estudar Node.js no Módulo 2",
  "prioridade": "medium"
}
```

O arquivo também contém cenários para título vazio, título com menos de 3 caracteres e requisição sem corpo, todos esperados com status `400`.

## Observações de Desenvolvimento

- A API foi desenvolvida para servir de base para integração com o front-end.
- As rotas de listagem e criação usam o SQLite e mantêm os dados após o encerramento do servidor.
- A rota `DELETE /api/tasks/:id` ainda utiliza o array provisório em memória e precisa ser adaptada para remover registros do SQLite.
- A interface inicial do projeto foi criada com foco em layout e fluxo de uso.
- As rotas `/api/health` e `/api/version` estão temporariamente desativadas no servidor.

## Próximos Passos Sugeridos

- adicionar atualização de tarefas
- adaptar a exclusão de tarefas para o SQLite
- integrar front-end com a API REST
- criar autenticação e gerenciamento de usuários
- evoluir a interface para um sistema mais completo de gestão de produtividade

## Conclusão

Este projeto representa a base inicial de um gerenciador de tarefas com arquitetura web moderna, demonstrando conceitos de interface, API REST e desenvolvimento em TypeScript. A estrutura atual já permite testar a operação do sistema e expandir o projeto para versões mais completas.
