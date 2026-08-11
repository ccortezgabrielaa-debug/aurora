# Aurora — Como o app funciona (README do produto)

## O que é
Aurora é uma plataforma **multi-marca de gestão de embaixadoras**. A marca cadastra embaixadoras, distribui cupons, acompanha vendas atribuídas e recompensa com **crédito** (cashback em loja) conforme regras configuráveis. A embaixadora acompanha tudo por um portal próprio.

O app tem **três perfis de acesso**:
- **Marca** — equipe da marca (ex.: "Aurora Studio" / "Niya"). Vê o painel completo de gestão.
- **Embaixadora** — quem divulga a marca. Vê apenas o portal pessoal.
- **Público** — visitante da landing page de inscrição.

## Fluxos principais

### 1. Entrada e onboarding (Marca)
1. **Login** → escolhe entrar como marca ou embaixadora.
2. **Onboarding** (marca nova): cria conta (nome, e-mail, senha) → cria o workspace (nome, logo, cor da marca) → confirmação → vai para o painel.
3. **Landing de inscrição**: página pública onde novas embaixadoras se candidatam ao programa.

### 2. Painel da Marca
- **Dashboard**: KPIs do período — embaixadoras ativas, GMV via cupom, taxa de resgate do crédito, conversão ativação→venda, e uso do orçamento vs. teto orçado.
- **Embaixadoras**: lista/gestão das embaixadoras, status e desempenho individual.
- **Cupons e Vendas**: cria cupons (integração Shopify) e lança/vê vendas atribuídas a cada cupom. Inclui fluxo "Lançar venda" (embaixadora, valor do pedido).
- **Crédito**: crédito em circulação, emitido e resgatado — o cashback que vira recompensa.
- **Regras**: configuração do programa — como cada ação (venda, conteúdo, indicação) gera crédito e como sobe de nível.
- **Conteúdo**: monitora publicações das embaixadoras que marcam a marca; cada peça pode gerar crédito.
- **Social Listening**: captura menções ao @ oficial da marca nas redes, com contagem diária.

### 3. Portal da Embaixadora
Abas: **Início** (resumo + nível), **Vendas** (atribuídas ao seu cupom), **Conteúdo** (marcar o @ oficial conta pontos), **Crédito** (saldo disponível para resgate). O nível (selo estrela) sobe conforme desempenho.

## Modelo de dados (conceitual)
- **Brand/Workspace**: nome, logo, cor, teto de orçamento.
- **Ambassador**: nome, avatar, cupom, nível, vendas, crédito acumulado.
- **Coupon**: código, marca, vendas atribuídas (Shopify).
- **Sale**: embaixadora, valor do pedido, cupom, data → gera crédito conforme regra.
- **Content mention**: peça publicada / menção capturada → pode gerar crédito.
- **Credit ledger**: crédito emitido, em circulação e resgatado.
- **Rule**: mapeia ação → crédito e critérios de nível.

## Regras de negócio-chave
- Venda válida = pedido com cupom da embaixadora (via Shopify) → percentual vira **crédito**.
- Conteúdo com menção ao @ oficial pode conceder crédito (definido em Regras).
- Crédito é **resgatável** como desconto em compras; a marca acompanha "taxa de resgate".
- O programa respeita um **teto de orçamento** — o Dashboard mostra o consumo.
- Níveis de embaixadora sobem por desempenho (vendas/conteúdo), destacados pelo selo estrela.

## Integrações
- **Shopify**: origem de cupons e vendas atribuídas.
- **Redes sociais**: menções ao @ oficial (Social Listening / Conteúdo).

## Permissões por perfil
| Recurso | Marca | Embaixadora | Público |
|---|---|---|---|
| Dashboard, Regras, Crédito (gestão), Embaixadoras | ✅ | — | — |
| Cupons e Vendas, Conteúdo, Social Listening | ✅ | — | — |
| Portal (vendas/conteúdo/crédito próprios) | — | ✅ | — |
| Landing de inscrição | — | — | ✅ |

## Telas → arquivos de referência
- Login → `Aurora Login.dc.html`
- Onboarding → `Aurora Onboarding.dc.html`
- Dashboard → `Aurora Dashboard.dc.html`
- Embaixadoras → `Aurora Embaixadoras.dc.html`
- Cupons e Vendas → `Aurora Cupons e Vendas.dc.html`
- Crédito → `Aurora Crédito.dc.html`
- Regras → `Aurora Regras.dc.html`
- Conteúdo → `Aurora Conteúdo.dc.html`
- Social Listening → `Aurora Social Listening.dc.html`
- Portal da embaixadora → `Aurora Portal.dc.html`
- Landing de inscrição → `Niya Landing Inscrição.dc.html`
- Protótipo navegável (junta tudo) → `Aurora Protótipo.dc.html`
- Índice de telas → `Aurora Índice.dc.html`
- Identidade visual (mark estrela, paleta, tipografia) → `Aurora Identidade.dc.html`

> Nota: "Niya" / "Aurora Studio" são marcas-exemplo dentro do protótipo. **Aurora** é a plataforma.

## Observação técnica
Os arquivos são protótipos em HTML (runtime próprio: `<x-dc>`, `<sc-if>`, `<sc-for>`, `{{ }}`; lógica no bloco `data-dc-script` ao fim de cada arquivo). São **referência de comportamento e aparência**, não backend. Recrie no ambiente de destino com dados reais.
