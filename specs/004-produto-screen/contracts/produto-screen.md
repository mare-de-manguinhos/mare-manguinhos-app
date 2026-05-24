# Contracts: ProdutoScreen Components

**Phase 1 Output** | **Date**: 2026-05-24

## 1. ProdutoScreen (tela)

**Arquivo**: `src/screens/vitrine/ProdutoScreen.tsx`

```typescript
interface ProdutoScreenProps {
  route: RouteProp<VitrineStackParamList, 'Produto'>;
  navigation: StackNavigationProp<VitrineStackParamList, 'Produto'>;
}
```

**Responsabilidades**:
- Receber `produtoId` dos parâmetros de rota
- Chamar `vitrineService.buscarProduto(id)` para carregar dados
- Gerenciar estados: `carregando`, `pronto`, `erro`
- Gerenciar seleção de corte e peso (estado local)
- Delegar renderização a componentes filhos
- Chamar `carrinhoStore.adicionarItem()` ao confirmar

**Layout** (ScrollView vertical):
```
[Header: seta voltar + título "Produto"]
[Foto do produto (largura total, ~300px)]
[Conteúdo:
  ├── Nome da espécie (heading)
  ├── Info do pescador (foto circular + nome) + badge disponibilidade
  ├── Descrição do produto
  ├── Preço por kg + peso disponível
  ├── Seletor de corte (CorteChip)
  ├── Seletor de peso (PesoControl)
  └── Valor total calculado]
[Botão "Adicionar ao Carrinho — R$ XX,XX" (fixo no fundo)]
```

---

## 2. CorteChip

**Arquivo**: `src/components/vitrine/CorteChip.tsx`

```typescript
interface CorteChipProps {
  cortes: Corte[];
  selecionado: Corte;
  onSelect: (corte: Corte) => void;
}
```

**Comportamento**:
- Renderiza chips lado a lado (horizontal scroll se necessário)
- Chip selecionado: bg `#1A5F7A` (Azul Mar), texto branco
- Chip não selecionado: bg `#FAFCFD` (Espuma), texto `#1A5F7A`, borda fina
- Cantos arredondados (borderRadius 12px)
- Touch target mínimo 44x44px
- `accessibilityLabel`: "Corte [nome do corte], selecionado" / "Corte [nome do corte]"

**Estados**:
| Estado | Aparência |
|--------|-----------|
| Selecionado | Fundo azul, texto branco, sem borda |
| Não selecionado | Fundo espuma, texto azul, borda 1px |
| Único corte | Chip desabilitado, selecionado por padrão |

---

## 3. PesoControl

**Arquivo**: `src/components/vitrine/PesoControl.tsx`

```typescript
interface PesoControlProps {
  peso: number;
  pesoDisponivel: number;
  onChange: (novoPeso: number) => void;
}
```

**Comportamento**:
- Layout horizontal: [−] [peso] [+]
- Passo: 0.5kg
- Mínimo: 0.5kg
- Máximo: `pesoDisponivel`
- Botão "−" desabilitado visualmente quando `peso <= 0.5`
- Botão "+" desabilitado visualmente quando `peso >= pesoDisponivel`
- Exibição do peso: 1 casa decimal, unidade "kg" (ex: "1,5 kg")
- Touch target mínimo 44x44px para botões
- `accessibilityLabel`: "Peso: [valor] kg. Botão diminuir. Botão aumentar."

**Estados**:
| Estado | Aparência |
|--------|-----------|
| Normal | Ambos botões ativos, peso exibido |
| Mínimo (0.5kg) | Botão "−" desabilitado (opacidade reduzida) |
| Máximo (= pesoDisponivel) | Botão "+" desabilitado (opacidade reduzida) |

---

## 4. MockProvider (service layer)

**Arquivo**: `src/services/vitrineService.ts` (já existe, modificar)

```typescript
buscarProduto: (id: string) => {
  if (USE_MOCK) {
    const mock = gerarProdutoDetalhado(id);
    if (!mock) throw new Error('Produto não encontrado');
    return Promise.resolve({ data: mock });
  }
  return api.get<Produto>(`/api/app/produtos/${id}`);
}
```

---

## 5. carrinhoStore (Zustand)

**Arquivo**: `src/store/carrinhoStore.ts` (CRIAR)

```typescript
interface CarrinhoStoreActions {
  adicionarItem: (produto: Produto, corte: Corte, pesoKg: number) => void;
  removerItem: (produtoId: string) => void;
  limpar: () => void;
  total: () => number;
}
```
