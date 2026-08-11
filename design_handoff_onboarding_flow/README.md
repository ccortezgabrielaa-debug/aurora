# Aurora — Gestão de Embaixadoras (implementação)

Implementação em React + TypeScript + Vite do produto Aurora, a partir dos
protótipos `.dc.html` e dos READMEs de handoff (design e produto) na raiz do
repositório. Cobre as três áreas descritas no README de produto: **Painel da
marca**, **Portal da embaixadora** e a **landing pública** de inscrição.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção em dist/
```

## Escopo implementado

Todas as 12 telas do protótipo (exceto os dois artefatos de navegação do
próprio design tool — Índice e Protótipo navegável, que não são telas do
produto):

**Acesso**
- `/login` — entrar como marca ou embaixadora (role switch), sem backend real.
  "Entrar" navega para `/dashboard` (marca) ou `/portal` (embaixadora).
  "Inscreva-se" leva à landing pública.
- `/onboarding/signup` → `/onboarding/workspace` → `/onboarding/done` — os 3
  passos de criação de conta e workspace, em alta fidelidade (validação,
  upload de logo, cor da marca, animações).

**Painel da marca** (nav inferior fixa: Início · Embaixadoras · Conteúdo · Crédito)
- `/dashboard` — KPIs por período, orçamento de crédito, ranking de
  embaixadoras, acessos rápidos para as 3 telas sem nav própria.
- `/embaixadoras` (+ `/embaixadoras/:handle`) — busca, filtro por tier,
  perfil com abas Vendas/Conteúdo/Crédito.
- `/conteudo` (+ `/conteudo/:idx`) — fila de monitoramento de permanência,
  detecção automática (marca/cupom/conta conectada), validar/reprovar.
- `/credito` (+ `/credito/:idx`) — crédito em circulação, resgates
  pendentes, extrato, aprovar/recusar resgate com endereço de envio.
- `/cupons-e-vendas` (+ `/cupons-e-vendas/nova`) — cupons Shopify, histórico
  de vendas, lançar venda com cálculo de crédito ao vivo por tier.
- `/regras` — editor de níveis de performance, crédito por conteúdo, prazos,
  pesos de pontuação, com preview calculado.
- `/social-listening` (+ `/social-listening/:idx`) — menções capturadas,
  filtro embaixadora/descoberta, baixar mídia / ver perfil / convidar creator.

**Portal da embaixadora** (nav inferior própria: Início · Vendas · Conteúdo · Crédito)
- `/portal`, `/portal/vendas`, `/portal/conteudo`, `/portal/credito` — nível
  e pontuação, cupom com copiar/compartilhar, vendas atribuídas, conteúdo
  monitorado, catálogo de resgate e extrato de crédito.

**Público**
- `/inscricao` — landing desktop (marca-exemplo "niya"): hero, benefícios,
  como funciona, formulário de candidatura com validação.

Não há backend: todos os dados (KPIs, embaixadoras, cupons, menções, etc.)
são mocks estáticos por tela, espelhando os valores dos protótipos — nenhuma
tela compartilha um "banco de dados" único entre si, da mesma forma que cada
`.dc.html` original também tinha seu próprio `state`/`data()` independente.

## Decisões de fidelidade

- **Cores, tipografia (Quicksand + Manrope), espaçamentos, raios e
  interações** seguem os protótipos à risca — são tratados como finais.
- **Chrome de dispositivo removido**: o bezel preto, a barra de status falsa
  ("9:41 ● ● ▪") e o home indicator dos `.dc.html` são artefatos de
  apresentação do protótipo (simulam um telefone dentro de uma página de
  design), não elementos de produto — o SO real já fornece isso.
  `Screen.tsx` mantém o layout mobile-first de coluna única, centralizado
  como cartão em telas largas.
- **`<image-slot>` não foi usado**: é um componente do runtime de protótipo
  do Design Canvas (auto-persistência via sidecar `.image-slots.state.json`,
  só disponível naquele ambiente). Fotos de produto/mídia capturada viram
  `MediaPlaceholder` (tile neutro); o logo do workspace usa
  `<input type="file">` nativo com preview local (`LogoUploader.tsx`).
- **Navegação para telas sem chrome no protótipo**: Cupons & Vendas, Regras e
  Social Listening não têm barra inferior nem botão de voltar nos mockups
  originais (são acessadas de algum hub não especificado nas telas
  individuais). Para ficarem navegáveis de verdade, adicionei um botão
  "voltar" leve a cada uma e um card de "Acessos rápidos" no Dashboard que
  linka as três — uma decisão de produto, não uma mudança visual do que já
  existia.
- Dados que aparecem em mais de uma tela (ex. as embaixadoras do ranking do
  Dashboard vs. da lista em Embaixadoras) mantêm os valores de cada protótipo
  de origem em vez de forçar consistência artificial entre eles — não existe
  banco de dados real por trás.

## Estrutura

```
src/
  components/   # Screen, SegmentedControl, PillSubTabs, FilterChips,
                # ListHeader, DarkPanelHeader/BackRow, BackHeader, IconButton,
                # Avatar, StatusBadge, MediaPlaceholder, Toast, SearchInput,
                # MarcaTabBar, PortalTabBar, AuroraMark, KpiCard, RankingRow,
                # LogoUploader, ColorSwatchPicker, StepDots
  context/      # OnboardingContext, ContentQueueContext, CreditContext
                # (estado compartilhado entre passos/telas de um mesmo fluxo)
  data/         # mocks por domínio: dashboardData, ambassadors, coupons,
                # contentQueue, credit, socialListening, portal
  pages/        # uma pasta por tela do Índice do protótipo
  styles/       # tokens.css — paleta Aurora Rosé, fontes, raios
```

## Tokens de marca

Ver `src/styles/tokens.css`. Paleta **Aurora Rosé** (opção 1b do documento de
identidade): rosé `#eab4bf` como acento primário, tinta `#26211e`, creme
`#f4efe8`/`#e9e3db` como superfícies. Mark: estrela de quatro pontas côncava
(`AuroraMark.tsx`).
