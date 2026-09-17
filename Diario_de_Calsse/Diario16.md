# Diário de Classe - Atividade de Segurança na API

## Reflexão sobre a atividade

Nessa atividade, entendi que o objetivo principal era tornar a API de tarefas mais segura, evitando que o usuário envie informações incorretas ou maliciosas.

Antes de alterar o código, fiz uma análise do projeto e comparei com o que era pedido no PDF. Algumas partes já estavam funcionando corretamente, então mantive o que era útil e ajustei apenas o que precisava melhorar.

## Validações e controle de dados

Coloquei validações para verificar os dados antes de enviá-los ao banco. Por exemplo:

- o título precisa ter pelo menos 3 caracteres;
- o status deve possuir um valor válido;
- a prioridade também precisa seguir regras esperadas;
- o ID precisa estar correto antes de qualquer operação.

Essas verificações ajudam a garantir que a API receba apenas entradas que fazem sentido e que evitem erros no sistema.

## Segurança nas consultas ao banco

Também alterei as consultas do banco para usar parâmetros com `?`. Essa prática é importante porque reduz o risco de SQL Injection, que acontece quando alguém insere um comando SQL no lugar de um dado comum.

No método `PUT`, a atualização da tarefa foi feita com esses parâmetros de forma segura. Já no `PATCH`, que atualiza apenas algumas informações, também deixei a alteração mais segura, usando transação para manter a consistência dos dados.

## Tratamento de erros

Além disso, melhorei o tratamento de erros para que a API não exponha detalhes internos do banco para o usuário. Também deixei a porta do servidor configurável, o que torna a aplicação mais flexível e fácil de ajustar em diferentes ambientes.

## Testes e validações

Acrescentei novos testes no arquivo `request.http` para verificar situações em que o usuário envia dados inválidos, como:

- ID negativo;
- ID decimal;
- número no lugar do título;
- status inexistente.

Esses testes ajudam a confirmar que a API responde corretamente quando a entrada não satisfaz as regras esperadas.

## Conclusão

Com essa atividade, entendi que a principal ideia foi não confiar diretamente nos dados enviados pelo usuário. Antes de qualquer operação no banco, a API precisa validar as informações e executar as consultas de forma segura.

Essa prática é essencial para manter o sistema confiável, estável e protegido contra falhas e tentativas de manipulação.