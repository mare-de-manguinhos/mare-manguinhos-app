# Data Model: ProdutoScreen

**Phase 1 Output** | **Date**: 2026-05-24

## 1. Mudanças em Tipos Existentes

### 1.1 `Produto` (adicionar `descricao?` opcional em `src/types/index.ts`)

```typescript
interface Produto {
  id: string;
  especie: string;
  foto: string;
  precoPorKg: number;
  pesoDisponivel: number;
  cortesDisponiveis: Corte[];
  badges?: string[];
  pescador: Pescador;
  categoria: Categoria;
  descricao?: string;  // <-- ADICIONADO: opcional, presente apenas no detail endpoint
}
```

**Contrato com backend**: `GET /api/app/produtos/:id` retorna o mesmo `Produto` preenchendo `descricao`.

**Relação entre tipos**:
| Campo | `ProdutoResumo` (vitrine) | `Produto` (completo) |
|-------|---------------------------|----------------------|
| `cortesDisponiveis` | ❌ | ✅ |
| `badges` | ✅ (opcional) | ✅ (opcional) |
| `categoria` | `string` | `Categoria` |
| `pescador.foto` | ❌ | ✅ |
| `descricao` | ❌ | ✅ (opcional) |

### 1.2 `ItemCarrinho` (já existe, sem alterações)

```typescript
interface ItemCarrinho {
  produto: Produto;
  corte: Corte;
  pesoKg: number;
}
```

### 1.3 `CarrinhoStore` (implementar em `src/store/carrinhoStore.ts`)

Interface já definida em `types/index.ts`:
```typescript
interface CarrinhoStore {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto, corte: Corte, pesoKg: number) => void;
  removerItem: (produtoId: string) => void;
  limpar: () => void;
  total: () => number;
}
```

## 2. State Transitions

### 2.1 Estado da ProdutoScreen

```
[carregando] ──dados carregados──> [pronto]
     │                                    │
     ├─erro de rede──> [erro]              ├─adicionar ao carrinho──> [pronto (toast)]
     │                    │                │
     │                    └─tentar         └─esgotado (peso=0)──> [pronto (btn disabled)]
     │                      novamente
     ▼
  [carregando]
```

### 2.2 Estados locais da tela

| Estado | Tipo | Valor inicial | Descrição |
|--------|------|---------------|-----------|
| `produto` | `ProdutoDetalhado \| null` | `null` | Dados do produto carregados da API/mock |
| `status` | `'carregando' \| 'pronto' \| 'erro'` | `'carregando'` | Estado de carregamento da tela |
| `corteSelecionado` | `Corte` | `cortesDisponiveis[0]` | Corte atualmente selecionado |
| `pesoSelecionado` | `number` | `0.5` | Peso em kg atualmente selecionado |

## 3. Validation Rules

### Peso
| Regra | Condição | Comportamento |
|-------|----------|---------------|
| Mínimo | `pesoSelecionado < 0.5` | Bloquear decremento |
| Máximo | `pesoSelecionado > pesoDisponivel` | Bloquear incremento |
| Passo | Incremento/decremento | 0.5kg |
| Formato | Exibição | 1 casa decimal (ex: "1,5 kg") |

### Corte
| Regra | Condição | Comportamento |
|-------|----------|---------------|
| Seleção única | Apenas um corte por vez | Toggle entre opções |
| Padrão | Ao carregar | Primeiro do array |
| Array vazio | `cortesDisponiveis.length === 0` | Ocultar seletor, assumir `'inteiro'` |

### Adição ao Carrinho
| Regra | Condição | Comportamento |
|-------|----------|---------------|
| Produto esgotado | `pesoDisponivel === 0` | Botão desabilitado: "Indisponível" |
| Sucesso | Corte + peso válidos | Chamar `carrinhoStore.adicionarItem()` |
| Feedback | Após adicionar | Toast "Adicionado ao carrinho!" (2s) |

## 4. Mock Data

Adicionar ao arquivo `src/services/vitrineDataMock.ts`:

```typescript
export function gerarProdutoDetalhado(id: string): ProdutoDetalhado | null {
  const resumo = vitrineDataMock.produtos.find(p => p.id === id);
  if (!resumo) return null;

  return {
    id: resumo.id,
    especie: resumo.especie,
    foto: resumo.foto,
    precoPorKg: resumo.precoPorKg,
    pesoDisponivel: resumo.pesoDisponivel,
    cortesDisponiveis: ['inteiro', 'limpo', 'file'],
    pescador: {
      id: resumo.pescador.id,
      nome: resumo.pescador.nome,
      foto: `https://i.pravatar.cc/150?u=${resumo.pescador.id}`,
    },
    descricao: `${
      resumo.especie === 'Camarão Rosa' ? 'Camarão fresco capturado esta manhã em Manguinhos. Ideal para grelhados, frituras e moquecas.' :
      resumo.especie === 'Robalo' ? 'Robalo pescado hoje pela manhã em Manguinhos. Carne firme e saborosa, perfeito para assados e grelhados.' :
      resumo.especie === 'Tilápia' ? 'Tilápia fresca de criação sustentável. Carne branca e suave, ideal para filés e grelhados.' :
      resumo.especie === 'Siri Mole' ? 'Siri mole fresco, crocante e saboroso. Tradição da culinária capixaba.' :
      resumo.especie === 'Corvina' ? 'Corvina fresca pescada em alto-mar. Carne firme e sabor marcante.' :
      resumo.especie === 'Lagosta' ? 'Lagosta fresca capturada em Manguinhos. Produto premium, ideal para ocasiões especiais.' :
      `${resumo.especie} fresco, direto do pescador de Manguinhos. Produto de alta qualidade.`
    }`,
  };
}
```
