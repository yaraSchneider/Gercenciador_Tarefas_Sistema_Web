# Gerenciador de Tarefas - Sistema Web

## Visão Geral

Este projeto é um sistema web de gerenciamento de tarefas desenvolvido para praticar a criação de interfaces responsivas e a implementação de uma API REST com Node.js e Express.

A estrutura atual combina:

- front-end em HTML com Tailwind CSS
- backend em TypeScript
- API REST para manipular tarefas em memória
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

As atualizações implementadas hoje incluem:

- criação do servidor Express em TypeScript
- configuração do projeto com scripts de desenvolvimento e build
- implementação de API REST para tarefas
- banco de dados provisório em memória (RAM)
- rotas de diagnóstico e gestão de tarefas

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

#### Health Check

```http
GET /api/health
```

Resposta:

```json
{
  "status": "ok",
  "message": "Servidor do Gestor de Tarefas ativo!"
}
```

#### Versão da aplicação

```http
GET /api/version
```

Resposta:

```json
{
  "appName": "Gestor de Tarefas",
  "version": "1.0.0"
}
```

#### Listar tarefas

```http
GET /api/tasks
```

#### Criar tarefa

```http
POST /api/tasks
Content-Type: application/json
```

Body de exemplo:

```json
{
  "title": "Estudar Node.js no Módulo 2"
}
```

#### Remover tarefa

```http
DELETE /api/tasks/:id
```

## Banco de Dados Atual

Atualmente, o projeto usa uma estrutura em memória para armazenar as tarefas, o que permite testar o fluxo de criação, leitura e exclusão sem a necessidade de banco externo.

Exemplo de estrutura:

```json
[
  {
    "id": 1,
    "title": "Estudar Arquitetura REST no Módulo 2",
    "status": "pending"
  }
]
```

## Como Testar as Rotas

O arquivo `Aula_5e6/request.http` contém exemplos prontos para uso com clientes HTTP como VS Code REST Client ou ferramentas similares.

Exemplos:

```http
GET http://localhost:3000/api/health
GET http://localhost:3000/api/tasks
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Estudar Node.js no Módulo 2"
}
```

## Observações de Desenvolvimento

- A API foi desenvolvida para servir de base para integração com o front-end.
- O armazenamento atual é temporário e fica em memória durante a execução do servidor.
- A interface inicial do projeto foi criada com foco em layout e fluxo de uso.
- O próximo passo natural é conectar a interface com as rotas da API e implementar persistência real de dados.

## Próximos Passos Sugeridos

- integrar front-end com a API REST
- adicionar atualização de tarefas
- implementar persistência com banco de dados real
- criar autenticação e gerenciamento de usuários
- evoluir a interface para um sistema mais completo de gestão de produtividade

## Conclusão

Este projeto representa a base inicial de um gerenciador de tarefas com arquitetura web moderna, demonstrando conceitos de interface, API REST e desenvolvimento em TypeScript. A estrutura atual já permite testar a operação do sistema e expandir o projeto para versões mais completas.
