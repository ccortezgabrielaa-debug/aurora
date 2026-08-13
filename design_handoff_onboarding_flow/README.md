# Aurora — Gestão de Embaixadoras (implementação)

Implementação em React + TypeScript + Vite + Supabase do produto Aurora, a
partir dos protótipos `.dc.html` e dos READMEs de handoff (design e produto)
na raiz do repositório. Cobre as três áreas descritas no README de produto:
**Painel da marca**, **Portal da embaixadora** e a **landing pública** de
inscrição — com banco de dados, autenticação e regras de acesso reais.

## Rodando localmente

```bash
cp .env.example .env   # preencha com o projeto Supabase (veja abaixo)
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção em dist/
```

## Backend: Supabase

Projeto: **aurora-embaixadoras** (`wfopflvqppzznahdtvyp`), já existente na
conta e usado como banco deste app — não foi criado do zero.

### Autenticação e papéis

- Supabase Auth (e-mail/senha). A tabela `profiles` (1:1 com `auth.users`)
  guarda `role` (`brand_admin` | `ambassador`) e o vínculo — `brand_id` para
  marca, `ambassador_id` (+ `brand_id`, necessário para a policy de leitura
  da própria marca) para embaixadora.
- **Onboarding de marca** (`/onboarding/signup` → `workspace`) faz
  `supabase.auth.signUp` de verdade, depois cria a `brands` e o `profiles`
  correspondente. O projeto tem confirmação de e-mail ativada — se o signup
  não retornar sessão, a tela mostra "confirme seu e-mail" em vez de avançar.
- **Convite de embaixadora**: o botão "+" em Embaixadoras chama a Edge
  Function `create-ambassador` (`supabase/functions/create-ambassador/`), que
  roda com a service role para criar o login da embaixadora sem derrubar a
  sessão da marca logada (criar um usuário no cliente troca a sessão ativa —
  por isso isso não pode ser feito direto do browser). A função valida que
  quem chamou é `brand_admin`, cria a `ambassadors`, o `auth.users` já
  confirmado e o `profiles` (`role: 'ambassador'`) atomicamente, e devolve
  uma senha temporária pra marca repassar.
- Toda leitura/escrita passa por **RLS** — `brand_admin` só vê/edita linhas
  da própria `brand_id`; `ambassador` só as suas próprias (via
  `current_brand_id()`/`current_role_type()`/`current_ambassador_id()`,
  funções `SECURITY DEFINER` que leem `profiles`). Não há bypass no
  frontend — o `anon`/`publishable key` em `.env` só enxerga o que a RLS
  permitir para o usuário autenticado.

### Schema

As tabelas (`brands`, `profiles`, `ambassadors`, `coupons`, `sales`,
`content_posts`, `credit_ledger`, `redemptions`, `credit_rules`) já existiam
no projeto. Duas migrações foram adicionadas por este trabalho:

- `redemptions_status_and_details` — a tabela não tinha `status`
  (solicitado/enviado/recusado) nem os campos de detalhe (`variant`,
  `shipping_address`, `production_cost`) que a tela de Crédito precisa.
- `ambassador_stats_view` — view `security_invoker` que agrega, por
  embaixadora, `sales_count_30d`, `gmv_30d`, `content_approved_30d`,
  `credit_balance` e `score`; reusada pelo Dashboard, Embaixadoras e Portal.
  Por ser `security_invoker`, a RLS das tabelas de origem se aplica
  normalmente a quem consulta — nenhuma policy própria foi necessária.
- `brands_instagram_handle` — coluna `instagram_handle` em `brands`, para o
  cadastro de onboarding (ver abaixo).

### Cadastro de marca e busca automática de Instagram

O onboarding (`/onboarding/workspace`) coleta, além do nome da marca:
**e-mail (`billing_email`)**, **CNPJ (`cnpj`)** e **@ do Instagram
(`instagram_handle`)** — todos opcionais, salvos direto em `brands`. O mesmo
campo de @ do Instagram existe no cadastro de embaixadora
(`/embaixadoras/nova`, coluna `ambassadors.handle`, já existente no schema).

Os dois formulários têm um botão **"Buscar dados"** ao lado do campo de
Instagram, que chama `fetchInstagramProfile()`
(`src/lib/instagram.ts`) — a fonte de dados escolhida para essa busca é o
**Windsor.ai**. A função já está com a assinatura e o fluxo de UI prontos
(estado de carregando, card de prévia com nome/seguidores/foto, preenchimento
automático de campos quando a busca funciona), mas a chamada real à API do
Windsor.ai depende do conector estar autorizado nesta conta do claude.ai —
enquanto isso não acontece, a função falha de propósito com uma mensagem
amigável ("busca automática indisponível") e o cadastro segue funcionando
normalmente só com o @ digitado manualmente.

### Dados derivados (não há tabela de KPI pronta)

Nada no schema pré-agrega métricas — todo número do Dashboard, do "nível"
da embaixadora e do cálculo de crédito é **calculado em `src/lib/queries/`**
a partir das tabelas brutas:

- **KPIs do Dashboard** (`queries/dashboard.ts`): "embaixadoras ativas" =
  embaixadoras distintas com venda ou conteúdo no período (não o `status`
  estático); deltas comparam com o período anterior de mesmo tamanho;
  "orçamento" prorata `credit_rules.content_monthly_cap` (um teto *por
  embaixadora*) pelo nº de ativas × dias/30 — o schema não tem um teto único
  da marca para comparar.
- **Nível de performance** (Base/Performance/Top, `queries/creditRules.ts`):
  `ambassadors.level` (nano/micro/macro) é uma classificação manual de porte
  — o nível de performance é outra coisa, calculado batendo
  `sales_count_30d`/meses-ativa contra os critérios de
  `credit_rules.performance_tiers` (JSON), escolhendo o maior nível que a
  embaixadora atinge. A taxa de crédito de cada venda usa esse cálculo.
- **Extrato misto** (`queries/ledger.ts`): `credit_ledger` (só entradas,
  sempre positivo) e `redemptions` (só saídas) são tabelas separadas — quem
  precisava do extrato único do mockup (perfil da embaixadora, Crédito,
  Portal) mescla as duas por data no cliente.
- **Fila de Conteúdo** (`queries/content.ts`): o mockup tinha um status
  sintético de 4 estados (monitorando/validado/removido/revisar); o schema
  real só tem `approval_status` (pending/approved/rejected) + checklist
  booleano + `still_live`. O status exibido é **derivado** desses campos
  (`deriveStatus`), e a permanência (dias no ar / 24h ou 30 dias) é estimada
  a partir de `publish_date`, já que não existe um campo de prazo — ver
  comentário em `deriveStatus`/`TARGET_DAYS`.

### O que ficou fora do banco

- **Social Listening** continua com dados mockados
  (`src/data/socialListening.ts`) — o schema fornecido não tem tabela de
  menções de redes sociais, e adicionar uma ficou fora do escopo pedido.
- **Cor da marca e logo do onboarding** não persistem — `brands` não tem
  coluna de cor, e não há Storage bucket configurado para upload de logo.
  A prévia funciona durante a sessão (via `URL.createObjectURL`), mas some
  ao recarregar.
- **Catálogo de resgate** (Portal → Crédito) é ilustrativo — não existe
  tabela de produtos/estoque; `redemptions.item_redeemed` é texto livre que
  só a marca cria (não há policy de `INSERT` para `ambassador` nessa
  tabela), então mesmo no mockup original não havia um fluxo de "pedir
  resgate" pela embaixadora.

## Escopo implementado (12 telas do protótipo)

**Acesso**
- `/login` — e-mail/senha real (Supabase Auth); roteia por `profiles.role`.
- `/onboarding/signup` → `/onboarding/workspace` → `/onboarding/done` — cria
  conta, marca e vínculo de verdade.

**Painel da marca** (nav inferior fixa: Início · Embaixadoras · Conteúdo · Crédito)
- `/dashboard`, `/embaixadoras` (+ `/nova`, `/:id`), `/cupons-e-vendas`
  (+ `/nova`), `/conteudo` (+ `/:idx`), `/credito` (+ `/:idx`), `/regras`,
  `/social-listening` (+ `/:idx`, mock).

**Portal da embaixadora** (nav própria: Início · Vendas · Conteúdo · Crédito)
- `/portal`, `/portal/vendas`, `/portal/conteudo`, `/portal/credito`.

**Público**
- `/inscricao` — landing desktop (marca-exemplo "niya"); formulário
  client-side, sem persistência (fiel ao protótipo original, que também não
  chamava nenhum backend).

## Dados de demonstração

O projeto Supabase foi populado com uma marca de exemplo para testar o app
já logando:

| Papel | E-mail | Senha |
|---|---|---|
| Marca (brand_admin) | `admin@niya-demo.aurora.app` | `AuroraDemo123!` |
| Embaixadora | `marina@niya-demo.aurora.app` | `AuroraDemo123!` |

Marca **Niya**, 6 embaixadoras (Marina Duarte, Bia Rocha, Clara Nunes, Duda
Freitas, Helena Sá, Lorena Pires) com vendas, conteúdo, crédito e resgates
espalhados nos últimos 90 dias — dá pra ver os 3 períodos do Dashboard, os 4
estados da fila de Conteúdo e os 3 status de resgate populados de verdade.
Uma marca nova criada pelo onboarding começa vazia (dashboard zerado, sem
embaixadoras) — comportamento correto de um SaaS real.

## Decisões de fidelidade (design)

- **Cores, tipografia (Quicksand + Manrope), espaçamentos, raios e
  interações** seguem os protótipos à risca — são tratados como finais.
- **Chrome de dispositivo removido**: bezel, barra de status falsa e home
  indicator dos `.dc.html` são artefatos de apresentação do protótipo, não
  elementos de produto — o SO real já fornece isso. `Screen.tsx` mantém o
  layout mobile-first de coluna única, centralizado como cartão em telas
  largas.
- **`<image-slot>` não foi usado**: é um componente do runtime de protótipo
  do Design Canvas, só disponível naquele ambiente. Fotos de produto/mídia
  capturada viram `MediaPlaceholder` (tile neutro); o logo do workspace usa
  `<input type="file">` nativo (`LogoUploader.tsx`).
- **Navegação para telas sem chrome no protótipo**: Cupons & Vendas, Regras
  e Social Listening não têm barra inferior nem botão de voltar nos mockups
  originais. Para ficarem navegáveis de verdade, cada uma ganhou um botão
  "voltar" leve, e o Dashboard ganhou um card de "Acessos rápidos" que linka
  as três.

## Estrutura

```
src/
  components/   # Screen, SegmentedControl, PillSubTabs, FilterChips,
                # ListHeader, DarkPanelHeader/BackRow, BackHeader, IconButton,
                # Avatar, StatusBadge, MediaPlaceholder, Toast, SearchInput,
                # MarcaTabBar, PortalTabBar, RequireRole, AuroraMark, KpiCard,
                # RankingRow, LogoUploader, ColorSwatchPicker, StepDots
  context/      # AuthContext (sessão/perfil), OnboardingContext,
                # ContentQueueContext, CreditContext (lista + toast por área)
  lib/
    supabase.ts       # client (env vars)
    database.types.ts # tipos gerados do schema real
    functions.ts      # invoca a Edge Function create-ambassador
    format.ts, avatarColor.ts
    queries/      # acesso a dados por domínio: dashboard, ambassadors,
                  # coupons, content, credit, creditRules, ledger, portal, brand
  data/         # mocks restantes: socialListening (sem tabela no schema),
                # dashboardData (só labels de UI)
  pages/        # uma pasta por tela do Índice do protótipo
  styles/       # tokens.css — paleta Aurora Rosé, fontes, raios
supabase/
  functions/create-ambassador/  # Edge Function (service role)
```

## Tokens de marca

Ver `src/styles/tokens.css`. Paleta **Aurora Rosé** (opção 1b do documento de
identidade): rosé `#eab4bf` como acento primário, tinta `#26211e`, creme
`#f4efe8`/`#e9e3db` como superfícies. Mark: estrela de quatro pontas côncava
(`AuroraMark.tsx`).
