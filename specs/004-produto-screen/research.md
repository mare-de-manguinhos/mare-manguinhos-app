# Research: ProdutoScreen

**Phase 0 Output** | **Date**: 2026-05-24

## Overview

Nenhum `NEEDS CLARIFICATION` foi identificado na spec. A pesquisa concentrou-se em confirmar decisões técnicas e padrões existentes no codebase para garantir alinhamento com a arquitetura vigente.

## Codebase State (Descobertas)

### ProdutoScreen Atual
- Arquivo `src/screens/vitrine/ProdutoScreen.tsx` existe como stub de 21 linhas
- Lê `produtoId` dos parâmetros de rota (`VitrineStackParamList`)
- Renderiza apenas placeholder texto com o ID

### Navegação
- `VitrineStackParamList` já definido: `{ Vitrine: undefined, Produto: { produtoId: string } }`
- `VitrineStack.tsx` já registra `Produto` screen (title: 'Produto')
- Navegação a partir de `ProdutoCard.onPress` já implementada na VitrineScreen

### Serviços
- `vitrineService.buscarProduto(id: string)` existe mas retorna `GET /api/app/produtos/{id}`
- `USE_MOCK = true` hardcoded em `vitrineService.ts`
- Nenhum dado mockado para produto individual — apenas `vitrineDataMock` (a lista completa)

### Tipos Existentes
- `Produto`: tipo completo com `cortesDisponiveis` mas **sem** `descricao`
- `ProdutoResumo`: tipo reduzido sem `cortesDisponiveis` e sem `descricao`
- `Corte`: `'inteiro' | 'limpo' | 'file'`
- `Pescador`: `{ id, nome, foto }`
- Nenhum `carrinhoStore.ts` implementado — apenas interface `CarrinhoStore` em `types/index.ts`

### Carrinho
- `src/store/` só contém `authStore.ts`
- Interface `CarrinhoStore` definida em `types/index.ts` com `adicionarItem`, `removerItem`, `limpar`, `total`
- `CarrinhoScreen` é stub

## Decisões Técnicas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Tipo para produto detalhado | `Produto` com `descricao?: string` | Simplifica o modelo: o detail endpoint retorna o mesmo `Produto` com `descricao` opcional. Evita duplicação de tipos e casting. `ProdutoResumo` (vitrine) continua como subtipo parcial. |
| Estado local da tela | `useState` (sem Zustand) | Princípio VI (YAGNI): estado de seleção (corte, peso) é local da tela. Store só para carrinho. |
| Mock de produto individual | Mock function que gera detalhe a partir de produto da vitrine | Reaproveita dados existentes, evita duplicação. |
| Implementação do carrinho | Criar `carrinhoStore.ts` com Zustand | Necessário para `adicionarItem` funcionar. Interface já definida em `types/index.ts`. |
| Componente de controle de peso | Novo componente `PesoControl` | Lógica específica (incremento/decremento 0.5kg, limites) merece componente próprio. |
| Componente de seleção de corte | Novo componente `CorteChip` | Similar a `CategoriaChip` mas com seleção única obrigatória. |

## Alternativas Consideradas

| Alternativa | Rejeitada Porque |
|-------------|-------------------|
| ~~Adicionar `descricao?` opcional a `Produto`~~ | **APROVADO**: Decisão revisada — `descricao?` opcional adicionada para simplificar o modelo, eliminando a interface `ProdutoDetalhado` e a necessidade de casting |
| Usar `react-hook-form` para controle de peso | `useState` simples é suficiente (Princípio VI — sem bibliotecas de formulário no MVP) |
| Colocar seleção de corte/peso no Zustand | Estado local da tela, não global — violaria separação de responsabilidades |
| Componente único `ProdutoForm` | Manter componentes separados (CorteChip, PesoControl) facilita teste e reuso |

## Dependências

| Dependência | Uso | Status |
|-------------|-----|--------|
| `zustand` | `carrinhoStore` | Já instalada (usada em authStore) |
| `@react-navigation/native` + stack | Navegação ProdutoScreen | Já instalada |
| `nativewind` | Estilização | Já instalada |
| `axios` | API call (via `vitrineService`) | Já instalado |
