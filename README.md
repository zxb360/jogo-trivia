# Jogo Trivia

Projeto frontend de um jogo de perguntas e respostas usando React, TypeScript, Vite, Context API, Tailwind CSS e testes com Vitest.

A ideia e simples: o usuario entra, informa um e-mail para receber/recuperar um token da Open Trivia DB, joga uma rodada de perguntas, responde antes do tempo acabar e acumula pontos. Como diria uma analogia no espirito do Finney: o estado do app e como uma funcao bem comportada; quando a entrada muda, a tela precisa responder sem drama, sem salto estranho e sem misterio no limite.

## Tecnologias

- React 19 para a interface.
- TypeScript para tipagem e mais seguranca durante o desenvolvimento.
- Vite para ambiente de desenvolvimento, build e preview.
- React Router DOM para rotas entre Home e Jogo.
- Context API para compartilhar login, token e funcoes de autenticacao.
- Axios para requisicoes HTTP.
- Tailwind CSS para estilizar a interface com classes utilitarias.
- Vitest para testes automatizados.
- Testing Library para testar componentes como o usuario usaria.
- ESLint para manter o codigo mais consistente.

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Rode em modo desenvolvimento:

```bash
npm run dev
```

Gere a build de producao:

```bash
npm run build
```

Rode os testes:

```bash
npm test
```

Rode o lint:

```bash
npm run lint
```

Gere cobertura de testes:

```bash
npm run coverage
```

## Scripts

- `npm run dev`: inicia o Vite e abre o projeto no navegador.
- `npm run build`: executa TypeScript e gera a build com Vite.
- `npm run preview`: visualiza localmente a build gerada.
- `npm test`: roda a suite de testes com Vitest.
- `npm run coverage`: roda os testes com relatorio de cobertura.
- `npm run lint`: executa o ESLint no projeto.

## Estrutura

```txt
src/
  assets/
    jogo_trivia.png
    hero.png
    react.svg
    vite.svg
  context/
    LoginContext.tsx
    LoginProvider.tsx
  pages/
    Home.tsx
    Jogo.tsx
  test/
    Home.test.tsx
    Jogo.test.tsx
    Login.test.tsx
    setupTests.ts
  types/
    question.ts
  App.tsx
  index.css
  main.tsx
```

Arquivos de configuracao importantes:

- `vite.config.ts`: configuracao principal do Vite, React, Tailwind e ambiente de teste.
- `vitest.config.ts`: configuracao dedicada do Vitest.
- `eslint.config.js`: regras de lint.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: configuracoes TypeScript.
- `package.json`: dependencias, scripts e metadados do projeto.

## Rotas

As rotas ficam em `src/App.tsx`:

- `/`: renderiza a pagina `Home`.
- `/jogo`: renderiza a pagina `Jogo`.

A aplicacao e montada em `src/main.tsx`, onde o `LoginProvider` envolve o app inteiro. Isso permite que qualquer pagina acesse os dados do contexto.

## Context API

O estado global do projeto fica dividido em dois arquivos:

- `src/context/LoginContext.tsx`: cria o contexto e define o tipo dos dados compartilhados.
- `src/context/LoginProvider.tsx`: guarda o estado e implementa as funcoes.

O contexto disponibiliza:

- `isLoggedIn`: indica se o usuario iniciou o fluxo.
- `token`: token usado para buscar perguntas na Open Trivia DB.
- `login()`: libera a exibicao do formulario de login.
- `logout()`: limpa o estado local de login/token.
- `tokenLogin(email)`: busca ou reaproveita um token associado ao e-mail.

O token e salvo no `localStorage` em um mapa por e-mail (`trivia_tokens_map`). Se o token ainda estiver dentro do prazo de 6 horas, ele e reutilizado. Se passou do tempo, o app pede um novo token para a API.

## Conexoes Externas

O projeto usa a Open Trivia DB:

- Token de sessao:

```txt
https://opentdb.com/api_token.php?command=request
```

- Perguntas:

```txt
https://opentdb.com/api.php?amount=5&token=TOKEN_DO_USUARIO
```

O token ajuda a evitar repeticao de perguntas durante a sessao. No jogo, se a API retornar `response_code === 3`, o token e considerado expirado/invalido e removido do `localStorage`.

## Fluxo da Home

Arquivo: `src/pages/Home.tsx`

Primeiro, a Home mostra a imagem/logo do jogo e o botao `Play`. Ao clicar em `Play`, o estado `isLoggedIn` muda para `true`, e a tela passa a mostrar o formulario de e-mail.

Quando o usuario envia o formulario:

1. O e-mail e lido do estado local.
2. `tokenLogin(email)` e chamado pelo contexto.
3. O app navega para `/jogo`.
4. A pagina `Jogo` usa o token para buscar as perguntas.

## Fluxo do Jogo

Arquivo: `src/pages/Jogo.tsx`

O jogo busca 5 perguntas na Open Trivia DB usando Axios. Cada pergunta recebe um campo extra chamado `all_answers`, que junta as respostas incorretas com a correta e embaralha tudo.

Estados principais:

- `questions`: lista de perguntas carregadas.
- `score`: pontuacao atual.
- `currentQuestionIndex`: indice da pergunta atual.
- `isAnswered`: controla se a pergunta ja foi respondida ou bloqueada pelo tempo.
- `timer`: contador visual da pergunta.
- `selectedAnswer`: resposta escolhida pelo usuario.

Pontuacao:

- `easy`: 10 pontos.
- `medium`: 20 pontos.
- `hard`: 30 pontos.

Timer:

- Cada pergunta comeca com `15` segundos.
- O contador diminui a cada segundo.
- Quando chega em `0`, as alternativas sao bloqueadas.
- Ao clicar em `Proxima Pergunta`, o timer volta para `15`.

Pensando como numa curva do Finney: o timer tem que ser continuo para o usuario, mas discreto para o React. A cada segundo, um pequeno passo; no limite, chegou a zero, acabou a brincadeira.

## Tipos

Arquivo: `src/types/question.ts`

Define o formato esperado das perguntas retornadas pela API:

```ts
export type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};
```

No componente `Jogo`, esse tipo e estendido com `all_answers`, usado para renderizar todas as alternativas ja embaralhadas.

## Testes

Os testes ficam em `src/test/` e usam Vitest com Testing Library.

- `setupTests.ts`: importa `@testing-library/jest-dom`, liberando matchers como `toBeInTheDocument`.
- `Home.test.tsx`: testa renderizacao da Home e acao do botao Play.
- `Login.test.tsx`: testa o formulario de e-mail dentro da Home.
- `Jogo.test.tsx`: testa o carregamento inicial e a exibicao da primeira pergunta.

Configuracao:

- Ambiente `jsdom`, para simular o navegador.
- `globals: true`, para usar recursos globais do Vitest quando necessario.
- Mock de `axios` nos testes da pagina de jogo.
- Mock de `useNavigate` nos testes da Home.

Para rodar:

```bash
npm test
```

## Dependencias Instaladas

Dependencias de producao:

- `@tailwindcss/vite`
- `axios`
- `react`
- `react-dom`
- `tailwindcss`

Dependencias de desenvolvimento:

- `@eslint/js`
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@types/jest`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react`
- `eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `jsdom`
- `react-router-dom`
- `typescript`
- `typescript-eslint`
- `vite`
- `vitest`

## Observacoes de Desenvolvimento

- O projeto usa `dangerouslySetInnerHTML` para renderizar perguntas e respostas porque a Open Trivia DB retorna textos com entidades HTML.
- O embaralhamento das respostas acontece quando as perguntas chegam da API, evitando mudar a ordem a cada renderizacao.
- O estado global fica concentrado no Context API, evitando passar token e funcoes manualmente por props.
- O timer fica dentro de `Jogo.tsx`, porque e uma regra local da rodada, nao um estado global do app.

## Status

No estado atual, os testes e o lint passam:

```bash
npm test
npm run lint
```

Projeto pronto para subir com README decente, sem aquela cara de "foi o template do Vite que escreveu sozinho enquanto ninguem olhava".
