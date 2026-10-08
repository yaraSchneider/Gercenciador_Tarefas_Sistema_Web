# Diário da aula 05 - Introdução ao React

Hoje comecei a criar a interface do projeto em React com Vite e TypeScript. Primeiro, analisei a estrutura já existente do backend em Node + Express e confirmei que a API estava pronta em `http://localhost:3000`, com a rota `GET /api/health` e as rotas de tarefas em `/api/tasks`.

Depois, criei a pasta `web` com o projeto React usando o comando do Vite e configurei o ambiente com TypeScript e ESLint. Essa etapa foi importante para aprender a separar o front-end do back-end sem mexer na API existente.

Na interface, criei o componente `Saudacao`, que mostra a mensagem "Olá, turma! Minha primeira interface!". Também implementamos o contador interativo com `useState`, onde o botão atualiza o valor em tempo real sempre que o usuário clica.

Para conectar o React com o backend, usei `useEffect` para buscar `GET /api/health` quando a página carrega. Esse código mostra a mensagem "Conexão estabelecida com sucesso!" quando tudo funciona e "Erro ao conectar com o servidor" quando há algum problema.

Também configurei o CORS no back-end com `cors`, pois o front-end roda em `http://localhost:5173` e a API em `http://localhost:3000`. Isso foi necessário para permitir que a aplicação React conseguisse acessar a API sem bloquear a comunicação por origem diferente.

Decidi manter a autenticação do backend intacta e apenas criar a estrutura do front-end de forma compatível com a API real. Na parte da lista de tarefas, usei `map()` para renderizar os itens vindos da API e mostrar as tarefas em tela.

A parte mais desafiadora foi respeitar a estrutura real do projeto e não inventar rotas ou campos que não existissem. Foi preciso confirmar o formato da resposta da API e adaptar a interface `Tarefa` de acordo com os dados reais do back-end.

Com isso, o projeto ficou com o front-end funcionando, o contador interativo funcionando, a verificação do servidor funcionando e a lista de tarefas renderizada corretamente.

Aprendi que o React com Vite facilita muito a criação de interface moderna, e que a integração com a API fica muito mais organizada quando separo as chamadas em um arquivo `api.ts` e uso estados para controlar a interface.
