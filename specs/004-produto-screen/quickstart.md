# Quickstart: ProdutoScreen

**Phase 1 Output** | **Date**: 2026-05-24

## O que precisa ser criado/modificado

### Criar
| # | Arquivo | O que faz |
|---|---------|-----------|
| 1 | `src/store/carrinhoStore.ts` | Store Zustand do carrinho |
| 2 | `src/components/vitrine/CorteChip.tsx` | Seletor de corte (inteiro/limpo/file) |
| 3 | `src/components/vitrine/PesoControl.tsx` | Controle de peso (+/- 0.5kg) |

### Modificar
| # | Arquivo | O que muda |
|---|---------|------------|
| 4 | `src/services/vitrineService.ts` | Implementar `buscarProduto()` com fallback mock |
| 5 | `src/services/vitrineDataMock.ts` | Adicionar função `gerarProdutoDetalhado()` |
| 6 | `src/screens/vitrine/ProdutoScreen.tsx` | Implementar tela completa |
| 7 | `src/navigation/VitrineStack.tsx` | Ajustar header/title do Produto se necessário |

## Ordem de implementação sugerida

1. **Tipos** — Adicionar `descricao?` opcional a `Produto` em `src/types/index.ts`
2. **Mock** — Adicionar `gerarProdutoDetalhado()` a `vitrineDataMock.ts`
3. **Service** — Atualizar `vitrineService.buscarProduto()` para usar mock
4. **Store** — Criar `carrinhoStore.ts`
5. **Componentes** — Criar `CorteChip.tsx` e `PesoControl.tsx`
6. **Tela** — Implementar `ProdutoScreen.tsx` completa
7. **Verificar navegação** — Testar fluxo Vitrine → Produto → adicionar ao carrinho

## Teste manual

```text
1. Abrir app → VitrineScreen carrega
2. Tocar em qualquer card de produto → navega para ProdutoScreen
3. Verificar: foto, nome, pescador, descrição, preço, peso disponível
4. Tocar em diferentes cortes → seleção alterna
5. Ajustar peso com +/− → valor total atualiza
6. Tocar "Adicionar ao Carrinho" → toast de confirmação
7. Navegar para aba Carrinho → item aparece na lista
8. Testar edge cases: peso mínimo, peso máximo, erro de carregamento
```

## Paleta de cores (NativeWind)

| Token | Cor | Uso |
|-------|-----|-----|
| `bg-[#FDF6EC]` | Areia Clara | Fundo da tela |
| `bg-[#FAFCFD]` | Espuma | Cards, chips não selecionados |
| `bg-[#1A5F7A]` | Azul Mar | Botão principal, chip selecionado |
| `text-[#F2A23A]` | Laranja Solar | Badge de disponibilidade |
| `text-[#6B655A]` | Texto secundário | Labels, descrições |
