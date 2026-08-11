# Aurora — Fluxo de Onboarding (implementação)

Implementação em React + TypeScript + Vite do handoff de design descrito no
[README raiz do repositório](../README.md), a partir dos protótipos
`.dc.html` (Aurora Onboarding, Aurora Login, Aurora Dashboard, Aurora
Identidade).

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção em dist/
```

## Escopo implementado

O handoff prioriza o **fluxo de onboarding** (Signup → Workspace → Done) em
alta fidelidade. Login e Dashboard — as telas vizinhas do fluxo, para onde o
onboarding volta/avança — também foram implementadas para que a navegação
seja completa e testável de ponta a ponta:

- `/login` — entrar como marca ou embaixadora (role switch), sem backend real.
- `/onboarding/signup` — passo 1: nome, e-mail, senha (validação: nome
  obrigatório, senha ≥ 6 caracteres).
- `/onboarding/workspace` — passo 2: nome da marca, upload de logo (círculo,
  preview local via `URL.createObjectURL`), cor da marca (5 swatches).
- `/onboarding/done` — confirmação, com o nome/marca/cor escolhidos
  propagados via contexto (`OnboardingContext`).
- `/dashboard` — visão geral (KPIs, orçamento de crédito, ranking de
  embaixadoras), usando marca/cor/logo definidos no onboarding quando
  disponíveis.

Não há backend: os dados do dashboard (KPIs por período, ranking) são mocks
estáticos espelhando os valores dos protótipos.

## Decisões de fidelidade

- **Cores, tipografia (Quicksand + Manrope), espaçamentos, raios e
  interações** seguem os protótipos à risca — são tratados como finais,
  conforme o README de handoff.
- **Chrome de dispositivo removido**: o bezel preto, a barra de status falsa
  ("9:41 ● ● ▪") e o home indicator dos `.dc.html` são artefatos de
  apresentação do protótipo (simulam um telefone dentro de uma página de
  design), não elementos de produto. Em uma aplicação real rodando num
  navegador/telefone de verdade, o próprio SO já fornece essa barra — então
  eles não foram recriados. `Screen.tsx` mantém o layout mobile-first de
  coluna única, centralizado como cartão em telas largas.
- **`<image-slot>` não foi usado**: é um componente do runtime de protótipo
  do Design Canvas (auto-persistência via sidecar `.image-slots.state.json`,
  disponível só naquele ambiente). O upload de logo foi reimplementado como
  um `<input type="file">` nativo com preview local (`LogoUploader.tsx`).
- A tela de Login inclui também a variante "Embaixadora" (mencionada nos
  protótipos como fluxo irmão), mas o link "Inscreva-se" fica desabilitado
  — a landing de convite referenciada no protótipo (`Niya Landing
  Inscrição.dc.html`) não faz parte deste handoff.

## Estrutura

```
src/
  components/   # AuroraMark, SegmentedControl, StepDots, LogoUploader,
                # ColorSwatchPicker, BottomTabBar, KpiCard, RankingRow, Screen
  context/      # OnboardingContext — estado do fluxo (nome, e-mail, senha,
                # marca, cor, logo) compartilhado entre os 3 passos
  data/         # dashboardData.ts — mocks de KPIs por período e ranking
  pages/        # LoginPage, OnboardingSignupPage, OnboardingWorkspacePage,
                # OnboardingDonePage, DashboardPage
  styles/       # tokens.css — paleta Aurora Rosé, fontes, raios
```

## Tokens de marca

Ver `src/styles/tokens.css`. Paleta **Aurora Rosé** (opção 1b do documento de
identidade): rosé `#eab4bf` como acento primário, tinta `#26211e`, creme
`#f4efe8`/`#e9e3db` como superfícies. Mark: estrela de quatro pontas côncava
(`AuroraMark.tsx`).
