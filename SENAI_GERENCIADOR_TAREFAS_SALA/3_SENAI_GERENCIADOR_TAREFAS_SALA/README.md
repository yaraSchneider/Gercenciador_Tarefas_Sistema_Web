# Laboratório Prático: Gerenciador de Tarefas

Disciplina: Desenvolvimento de Sistemas Web — Prof. Alexandre Bendlin
Data: 28/10/2026

Este documento registra o que foi feito em cada momento do laboratório e traz as respostas do Diário de Bordo.

---

## Momento 1: O "Efeito Uau"

| Desafio | Arquivo | O que foi feito |
|---|---|---|
| Visual 1 (Cores) | `web/src/Login.tsx` | Botão "Entrar / Criar conta" trocado de `bg-blue-600` / `hover:bg-blue-500` para `bg-emerald-600` / `hover:bg-emerald-500`. |
| Visual 2 (Textos) | `web/src/Tarefas.tsx` | Texto do botão do formulário alterado de "Adicionar" para "Nova Tarefa". |
| Lógico Inicial | `web/src/Tarefas.tsx` | `useState<Prioridade>("medium")` alterado para `useState<Prioridade>("high")`. |

Ajuste extra: dentro da função `criar`, depois de salvar a tarefa o formulário voltava para `"medium"` (`setPrioridade("medium")`). Troquei para `"high"` para que o padrão se mantenha em todas as tarefas, e não só na primeira.

## Momento 2: Preenchendo as Lacunas

**Lacuna 1: chamada para a API (`web/src/api.ts`)**
Em `listarTarefas` faltava a requisição em si. Foi adicionado:

```ts
const res = await fetch(url, { headers: authHeaders() });
```

O `authHeaders()` envia o token JWT no cabeçalho `Authorization: Bearer ...`, que é o que o middleware `authenticate` do `server.ts` exige.

**Lacuna 2: proteção do formulário (`web/src/Tarefas.tsx`)**
Na função `criar`, antes de chamar a API:

```ts
if (tituloLimpo.length < 3) {
    setErro("O título da tarefa deve ter pelo menos 3 caracteres.");
    return;
}
```

O `trim()` já tinha sido aplicado em `tituloLimpo`, então títulos só com espaços também são bloqueados.

**Lacuna 3: botão que "quebra" a tela (`web/src/Login.tsx`)**
Adicionado `type="button"` no botão "Não tem conta? Registre-se" / "Já tem conta? Entrar".

Correção de sintaxe: o comentário `{/* TODO ... */}` estava dentro das propriedades do `<button>` principal, o que é inválido em JSX e impedia a compilação. Removi esse comentário. Os outros `TODO` também foram removidos, pois já foram resolvidos.

O projeto foi validado com `npm run build` no front-end (`tsc -b && vite build`), sem erros.

---

## Momento 3: Diário de Bordo

### Pergunta A: O que acontece na tela do React se usarmos uma variável comum em vez do `useState` para guardar dados que devem aparecer na interface?

Com uma variável comum (`let contador = 0`), o valor até muda na memória, mas a tela **não atualiza**. O React só redesenha um componente quando o estado muda por meio do `useState` (ou seja, pela função `setX`). Mexer numa variável comum não avisa o React de nada, então não acontece nenhum novo render e o usuário continua vendo o valor antigo.

Há um segundo problema: a variável comum é declarada dentro da função do componente, e essa função roda de novo a cada render. Se o componente renderizar por outro motivo, a variável é recriada com o valor inicial e o que foi guardado se perde. Já o `useState` faz o React guardar o valor entre os renders e redesenhar a tela quando ele muda.

No projeto, se `titulo` ou `tarefas` fossem variáveis comuns, o que o usuário digita não apareceria no campo e a lista não atualizaria depois de criar ou excluir uma tarefa.

### Pergunta B: Por que o formulário do Login recarregava a página inteira, e como o `type="button"` resolveu esse problema?

Dentro de um `<form>`, todo `<button>` sem `type` definido é, por padrão, do tipo `submit`. Por isso, clicar em "Não tem conta? Registre-se" disparava o envio do formulário, e o comportamento padrão do navegador ao enviar um form é recarregar a página. Isso apagava todo o estado do React (e-mail, senha, mensagens de erro).

Ao colocar `type="button"`, o botão deixa de ser de envio. Ele passa a executar só o `onClick` (trocar o `modo` entre login e registro) sem submeter o formulário, e a página não recarrega. Só o botão principal continua como `type="submit"`, e mesmo ele usa `e.preventDefault()` no `enviar` para o React controlar o envio sem recarregar.

### Pergunta C: Na sua opinião, qual a principal vantagem de usar o Tailwind CSS em vez de um arquivo `.css` tradicional?

Para mim, a maior vantagem é a **agilidade**: o estilo é feito direto na marcação, com classes utilitárias como `bg-emerald-600`, `rounded-md` e `px-4`. Não preciso ficar alternando entre o `.tsx` e o `.css`, nem inventar nomes de classe e lembrar onde cada uma foi definida. No Momento 1, trocar a cor do botão foi só mudar uma classe e ver o resultado na hora.

Outras vantagens que percebi: o estilo de um componente fica junto dele, então mexer ali não quebra o resto do site por acidente (num `.css` global uma regra pode afetar vários lugares). O design também fica consistente, porque as cores e espaçamentos vêm de uma escala padronizada. E o CSS final do build só inclui as classes que realmente foram usadas, ficando leve.

A desvantagem é que as linhas de `className` ficam longas, mas em React isso se resolve dividindo a interface em componentes.

---

## Como rodar

```bash
# Back-end (na raiz)
npm install
npm run dev

# Front-end (em outro terminal)
cd web
npm install
npm run dev
```
