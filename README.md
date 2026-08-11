# Handoff: Aurora — Fluxo de Onboarding (mobile)

## Overview
Fluxo de onboarding mobile do Aurora, uma plataforma de gestão de embaixadoras multi-marca. Três telas em sequência: **Signup** (criar conta) → **Workspace** (criar workspace da marca) → **Done** (confirmação). Ao final, o usuário segue para o painel da marca.

## About the Design Files
Os arquivos deste pacote são **referências de design em HTML** — protótipos que mostram a aparência e o comportamento pretendidos, **não** código de produção para copiar diretamente. A tarefa é **recriar estes designs no ambiente do codebase de destino** (React, Vue, SwiftUI, native etc.), usando os padrões e bibliotecas já estabelecidos nele. Se ainda não houver ambiente, escolha o framework mais adequado e implemente lá.

Observação técnica: o `.dc.html` usa um runtime próprio de protótipo (`<x-dc>`, `<sc-if>`, `<sc-for>`, `{{ }}`) — trate-o como pseudo-markup declarativo. A lógica de estado real está no bloco `<script ... data-dc-script>` no fim do arquivo, em JavaScript comum.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos, raios e interações são finais. Recrie a UI fielmente usando as bibliotecas/padrões do codebase.

## Screens / Views

### 1. Signup — "Crie sua conta"
- **Purpose**: usuário cria a conta (nome, e-mail, senha).
- **Layout**: tela mobile 320×672 (dentro de bezel 344px, canto 44px). Coluna flex, padding 14px 32px 0. Barra de status → botão voltar + indicador de progresso (2 pontos) → header → 3 campos → spacer flex → botão primário → home indicator.
- **Header**: kicker "PASSO 1 DE 2" (Manrope 600, 10px, tracking 2.5px, uppercase, #c67d88). Título "Crie sua conta" (Quicksand 700, 27px, #26211e). Subtítulo (Manrope 500, 13px, #8c8078).
- **Campos** (label uppercase 10px #a89b90 + input): Seu nome, E-mail, Senha. Input: fundo #fff, borda 1.5px #ece2d7, radius 14px, padding 14px 15px, Manrope 500 14px. Placeholder #c3b8ac.
- **Validação**: borda vira #c96a5e em nome vazio / senha < 6. Mensagem de erro da senha: Manrope 600 11px #c96a5e "A senha precisa de pelo menos 6 caracteres."
- **Botão**: "Continuar" — fundo #eab4bf, texto #26211e, Manrope 700 15px, padding 17px, radius 16px.
- **Voltar**: leva para a tela de Login.

### 2. Workspace — "Crie o workspace da sua marca"
- **Purpose**: nomear a marca, subir logo e escolher cor.
- **Progresso**: 2º ponto ativo (#eab4bf).
- **Logo**: círculo 88px, borda 2px dashed #d9b9c0, fundo #faf1f0, upload de imagem (crop circular).
- **Nome da marca**: input destacado — borda #eab4bf, Quicksand 600 15px, glow box-shadow 0 0 0 3px rgba(234,180,191,.2).
- **Cor da marca**: 5 swatches 36px circulares — #eab4bf, #c98a94, #b5c4b0, #c9b79a, #26211e. Selecionado recebe anel: box-shadow 0 0 0 2px #f4efe8, 0 0 0 4px #26211e.
- **Botão**: "Criar workspace" (mesmo estilo primário rosé).

### 3. Done — confirmação
- **Ícone**: círculo 66px #eab4bf com "✓" 30px, animação auPop.
- **Título**: "Tudo pronto, {primeiroNome}!" (Quicksand 700, 25px). Usa o primeiro nome do campo da tela 1.
- **Card do workspace**: fundo #fff, borda 1.5px #ece2d7, radius 18px. Quadrado 46px radius 14px na cor da marca com inicial (Quicksand 600 22px #fff) + nome + "WORKSPACE ATIVO".
- **Stats**: 2 cards #faf1f0 radius 16px — "0 · Embaixadoras" e "R$ 0 · GMV via cupom" (Quicksand 700 24px + label uppercase 10px #a89b90).
- **Botão primário**: "Ir para o painel" — fundo #26211e, texto #fff. Leva ao Dashboard.
- **Secundário**: link "Rever o fluxo" reinicia em signup.

## Interactions & Behavior
- Navegação entre telas via estado `screen` ('signup' | 'workspace' | 'done').
- `submitSignup`: valida nome não-vazio e senha ≥ 6; senão marca `showPassErr` e destaca bordas. Ok → 'workspace'.
- `submitWorkspace`: → 'done'.
- Voltar da tela 1 → Login; "Ir para o painel" → Dashboard; "Rever o fluxo" → 'signup'.
- Transições: cada tela entra com `auEnter` (opacity 0→1 + translateY 10px→0, .35s ease). Check final com `auPop` (scale .9→1, .5s).
- A cor escolhida na tela 2 propaga para inicial/quadrado da tela 3.

## State Management
Variáveis: `screen`, `name`, `email`, `pass`, `brand` (default "Aurora Studio"), `color` (default #eab4bf), `logo` (bool), `showPassErr` (bool).
Derivados: `passOk` (pass.length≥6), `nameOk`, `firstName` (primeira palavra do nome), `brandInitial` (1ª letra maiúscula da marca).

## Design Tokens
**Cores**
- Rosé primário: #eab4bf · Rosé escuro/acento: #c67d88 · Rosé claro: #f4c3cc
- Tinta/texto: #26211e · Texto secundário: #8c8078 · Label mute: #a89b90 · Placeholder: #c3b8ac
- Superfícies: #f4efe8 (tela), #e9e3db (fundo página), #faf1f0 (cards suaves), #fff (inputs/cards)
- Bordas: #ece2d7 / #e2d8cd / #e0d5c9 · Bezel: #1c1a18
- Erro: #c96a5e · Swatches marca: #eab4bf, #c98a94, #b5c4b0, #c9b79a, #26211e
**Tipografia**: Quicksand (400–700) display/wordmark/números; Manrope (400–700) corpo/UI/labels.
**Radius**: inputs 14px · botões 16px · cards 16–18px · tela 44px · bezel 56px.
**Sombra bezel**: 0 30px 70px -24px rgba(0,0,0,.55).

## Marca / Identidade
Mark do Aurora: **estrela de quatro pontas côncava** (sparkle), rosé #eab4bf. SVG path:
`M50 2 C53 40 60 47 98 50 C60 53 53 60 50 98 C47 60 40 53 2 50 C40 47 47 40 50 2 Z` em viewBox 0 0 100 100. Aparece no kicker do topo. Wordmark "aurora." em Quicksand 600, ponto final na cor de acento.

## Assets
- Sem imagens raster obrigatórias. O logo do workspace é um upload do usuário (placeholder circular).
- Fonts: Google Fonts — Quicksand e Manrope.
- Ícones: check "✓" é glifo de texto; a estrela é SVG inline (path acima).

## Files
- `Aurora Onboarding.dc.html` — o protótipo de onboarding (este handoff).
- `Aurora Identidade.dc.html` — board de identidade visual (mark, paleta, tipografia) para referência.
- Telas relacionadas do fluxo: `Aurora Login.dc.html`, `Aurora Dashboard.dc.html`.
