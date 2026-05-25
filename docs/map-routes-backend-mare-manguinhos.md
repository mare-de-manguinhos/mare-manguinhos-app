# Mapeamento de Endpoints p/ App Maré de Manguinhos

> **Objetivo:** Relação entre as telas do app consumidor e os endpoints que a API precisa fornecer para o MVP funcionar.
>
> **Contexto:** A API atual (`API.md`) atende o **sistema de gestão da associação** (associados, mensalidades, reuniões, etc.). O app de delivery precisa de uma **nova camada de endpoints** voltada ao consumidor final.

---

## 1. Resumo das Telas e Endpoints Necessários

| Tela | Método | Endpoint | Descrição |
|------|--------|----------|-----------|
| Login / Cadastro | `POST` | `/api/app/auth/cadastro` | Criar conta do consumidor |
| Login / Cadastro | `POST` | `/api/app/auth/login` | Autenticar consumidor (retorna JWT) |
| Login / Cadastro | `GET` | `/api/app/auth/eu` | Dados do consumidor logado |
| Vitrine (Home) | `GET` | `/api/app/vitrine` | Dados completos da tela inicial (pescadores + produtos + banner) |
| Vitrine (Busca) | `GET` | `/api/app/produtos` | Lista de produtos com filtros (categoria, pescador, busca) |
| Produto | `GET` | `/api/app/produtos/:id` | Detalhes de um produto |
| Checkout | `POST` | `/api/app/pedidos` | Criar pedido |
| Checkout | `POST` | `/api/app/frete/calcular` | Calcular frete por endereço |
| Checkout | `POST` | `/api/app/pagamento/pix` | Gerar QR Code Pix |
| Checkout | `POST` | `/api/app/pagamento/cartao` | Processar pagamento com cartão |
| Acompanhamento | `GET` | `/api/app/pedidos/:id` | Status de um pedido |
| Histórico | `GET` | `/api/app/pedidos/meus` | Lista de pedidos do consumidor |
| Perfil | `GET` | `/api/app/perfil` | Dados do perfil do consumidor |
| Perfil | `PUT` | `/api/app/perfil` | Atualizar perfil |
| Perfil | `GET` | `/api/app/enderecos` | Lista de endereços salvos |
| Perfil | `POST` | `/api/app/enderecos` | Salvar novo endereço |
| Perfil | `DELETE` | `/api/app/enderecos/:id` | Remover endereço |

---

## 2. Detalhamento por Tela

### 2.1 LoginScreen & RegisterScreen

**O que a tela faz:**
- Login: usuário informa e-mail + senha → recebe token JWT
- Cadastro: usuário informa nome, e-mail, telefone, senha → conta criada

**Endpoints:**

#### `POST /api/app/auth/cadastro`

**Body:**
```json
{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "telefone": "27999999999",
  "senha": "senha123"
}
```

**Retorno (201):**
```json
{
  "id": "uuid",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "token": "jwt-aqui"
}
```

---

#### `POST /api/app/auth/login`

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Retorno (200):**
```json
{
  "id": "uuid",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "token": "jwt-aqui"
}
```

---

#### `GET /api/app/auth/eu`

**Headers:** `Authorization: Bearer <token>`

**Retorno (200):**
```json
{
  "id": "uuid",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "telefone": "27999999999",
  "criadoEm": "2025-01-15T10:00:00Z"
}
```

---

### 2.2 VitrineScreen (Home do App)

**O que a tela faz:**
É a tela inicial do app, estilo home de delivery. Exibe:
- Banner promocional ("Fresco hoje! Direto do pescador")
- Seção "Nossos Pescadores" — scroll horizontal com foto, nome (funcionará como um filtro para os produtos listados na mesma tela, ao clicar no pescador mostra apenas produtos desse pescador)
- Filtros por categoria (Todos, Peixes, Crustáceos)
- Seção "Disponível agora" — cards de produtos com badges (Hoje, Premium, Favorito...) (interessante dois cards por linha)
- Barra de busca no topo

**Endpoints:**

#### `GET /api/app/vitrine`

**Descrição:** Retorna TODOS os dados necessários para montar a home em uma única chamada. Para alunos: um endpoint só, resposta completa, sem complicação.

**Retorno (200):**
```json
{
  "banner": {
    "titulo": "Fresco hoje!",
    "subtitulo": "Direto do pescador",
    "descricao": "Capturado esta manhã",
    "imagem": "https://..."
  },
  "pescadores": [
    {
      "id": "uuid",
      "nome": "Sr. Antônio",
      "foto": "https://...",
      "telefone": "(27) 99999-9991"
    },
    {
      "id": "uuid",
      "nome": "D. Marlene",
      "foto": "https://...",
      "telefone": "(27) 99999-9992"
    }
  ],
  "categorias": [
    { "id": "todos", "nome": "Todos" },
    { "id": "peixe", "nome": "Peixes" },
    { "id": "crustaceo", "nome": "Crustáceos" }
  ],
  "produtos": [
    {
      "id": "uuid",
      "especie": "Robalo",
      "foto": "https://...",
      "precoPorKg": 45.00,
      "pesoDisponivel": 12.5,
      "badges": ["Hoje", "Premium"],
      "pescador": {
        "id": "uuid",
        "nome": "Sr. Antônio"
      }
    },
    {
      "id": "uuid",
      "especie": "Camarão Rosa",
      "foto": "https://...",
      "precoPorKg": 65.00,
      "pesoDisponivel": 5.0,
      "badges": ["Hoje", "Favorito"],
      "pescador": {
        "id": "uuid",
        "nome": "D. Marlene"
      }
    }
  ]
}
```

> **Dica para o backend:** Esse endpoint pode fazer 2-3 queries internas (pescadores ativos + produtos em estoque + banner) e montar a resposta. O app faz UMA chamada e recebe TUDO. Simples.

---

#### `GET /api/app/produtos`

**Descrição:** Lista completa de produtos com filtros. Usado quando o usuário busca ou filtra por categoria.

**Query params (opcionais):**
- `busca` — texto da busca (ex: "robalo", "camarão")
- `categoria` — filtro por tipo (peixe, crustaceo)
- `pescador_id` — filtrar por pescador específico

**Retorno (200):**
```json
[
  {
    "id": "uuid",
    "especie": "Robalo",
    "foto": "https://...",
    "precoPorKg": 45.00,
    "pesoDisponivel": 12.5,
    "cortesDisponiveis": ["inteiro", "limpo", "file"],
    "badges": ["Hoje"],
    "pescador": {
      "id": "uuid",
      "nome": "Sr. Antônio",
      "foto": "https://...",
      "telefone": "(27) 99999-9991"
    }
  }
]
```

> **Dica:** Se a busca com texto for complexa no MVP, podem começar com filtro só por categoria e pescador. Busca por texto pode vir na Fase 2.

---

### 2.3 ProdutoScreen

**O que a tela faz:**
- Exibe detalhes de um produto específico
- Usuário escolhe o corte (inteiro, limpo ou filé)
- Usuário escolhe o peso desejado
- Botão "Adicionar ao carrinho"

**Endpoints:**

#### `GET /api/app/produtos/:id`

**Retorno (200):**
```json
{
  "id": "uuid",
  "especie": "Robalo",
  "foto": "https://...",
  "precoPorKg": 45.00,
  "pesoDisponivel": 12.5,
  "cortesDisponiveis": ["inteiro", "limpo", "file"],
    "pescador": {
      "id": "uuid",
      "nome": "Seu José",
      "foto": "https://...",
      "telefone": "(27) 99999-9993"
    },
    "descricao": "Peixe pescado hoje pela manhã em Manguinhos"
}
```

---

### 2.4 CarrinhoScreen

**O que a tela faz:**
- Exibe itens adicionados (armazenado localmente no app via Zustand)
- Permite remover itens
- Mostra subtotal
- Botão "Ir para checkout"

**Endpoints:** Nenhum necessário. O carrinho é gerenciado localmente no app (Zustand store). Só precisa da API quando for finalizar o pedido.

---

### 2.5 CheckoutScreen

**O que a tela faz:**
- Usuário seleciona ou cadastra endereço de entrega
- Escolhe entre entrega ou retirada
- Se entrega: calcula frete
- Escolhe forma de pagamento (Pix ou cartão)
- Revisa resumo e confirma pedido

**Endpoints:**

#### `POST /api/app/frete/calcular`

**Body:**
```json
{
  "endereco": "Rua X, 123, Bairro Y, Serra - ES",
  "latitude": -20.1234,
  "longitude": -40.5678
}
```

**Retorno (200):**
```json
{
  "valorFrete": 8.50,
  "prazoEstimadoMinutos": 45
}
```

> **Simplificação:** Se não der para calcular por distância no MVP, use um valor fixo (ex: R$ 8,00 para toda a região). Pode evoluir depois.

---

#### `POST /api/app/pedidos`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "itens": [
    {
      "produtoId": "uuid",
      "corte": "file",
      "pesoKg": 1.5
    }
  ],
  "enderecoEntrega": "Rua X, 123, Bairro Y, Serra - ES",
  "janelaEntrega": "14:00-16:00",
  "formaPagamento": "pix",
  "frete": 8.50,
  "valorTotal": 76.00
}
```

**Retorno (201):**
```json
{
  "id": "uuid",
  "status": "confirmado",
  "valorTotal": 76.00,
  "formaPagamento": "pix",
  "pix": {
    "qrCode": "00020126580014br.gov.bcb.pix...",
    "codigo": "abc123-def456"
  },
  "criadoEm": "2025-01-15T10:00:00Z"
}
```

---

#### `POST /api/app/pagamento/pix`

**Body:**
```json
{
  "pedidoId": "uuid",
  "valor": 76.00
}
```

**Retorno (200):**
```json
{
  "qrCode": "00020126580014br.gov.bcb.pix...",
  "codigo": "abc123-def456",
  "expiraEm": "2025-01-15T10:30:00Z"
}
```

> **Simplificação:** Se integração com gateway de pagamento for complexa para o MVP, use um Pix copia-e-cola fixo de teste e marque o pedido como "aguardando pagamento" manualmente.

---

#### `POST /api/app/pagamento/cartao`

**Body:**
```json
{
  "pedidoId": "uuid",
  "valor": 76.00,
  "tokenCartao": "tok_visa_123"
}
```

**Retorno (200):**
```json
{
  "status": "aprovado",
  "transacaoId": "txn_abc123"
}
```

> **Simplificação:** Use um sandbox de gateway (Mercado Pago, Stripe) em modo teste. Não precisa de produção no MVP.

---

### 2.6 AcompanhamentoScreen

**O que a tela faz:**
- Exibe status do pedido ativo: Confirmado → Em preparo → A caminho → Entregue
- Atualiza periodicamente (polling ou push)

**Endpoints:**

#### `GET /api/app/pedidos/:id`

**Headers:** `Authorization: Bearer <token>`

**Retorno (200):**
```json
{
  "id": "uuid",
  "status": "em_preparo",
  "itens": [
    {
      "produto": {
        "especie": "Robalo",
        "foto": "https://..."
      },
      "corte": "file",
      "pesoKg": 1.5
    }
  ],
  "enderecoEntrega": "Rua X, 123",
  "janelaEntrega": "14:00-16:00",
  "frete": 8.50,
  "valorTotal": 76.00,
  "formaPagamento": "pix",
  "criadoEm": "2025-01-15T10:00:00Z",
  "atualizadoEm": "2025-01-15T10:15:00Z"
}
```

**Status possíveis:**
| Status | Significado |
|--------|-------------|
| `confirmado` | Pedido recebido, aguardando preparo |
| `em_preparo` | Pescador está preparando |
| `a_caminho` | Saiu para entrega |
| `entregue` | Entregue ao consumidor |
| `cancelado` | Pedido cancelado |

---

### 2.7 HistoricoScreen

**O que a tela faz:**
- Lista todos os pedidos anteriores do consumidor
- Permite ver detalhes de cada um
- Botão "Repetir pedido" (re-adiciona itens ao carrinho)

**Endpoints:**

#### `GET /api/app/pedidos/meus`

**Headers:** `Authorization: Bearer <token>`

**Query params (opcionais):**
- `pagina` — paginação (default: 1)
- `limite` — itens por página (default: 20)

**Retorno (200):**
```json
{
  "pedidos": [
    {
      "id": "uuid",
      "status": "entregue",
      "valorTotal": 76.00,
      "criadoEm": "2025-01-15T10:00:00Z",
      "itensResumo": "Robalo (filé, 1.5kg)"
    }
  ],
  "totalPaginas": 3,
  "paginaAtual": 1
}
```

---

### 2.8 PerfilScreen

**O que a tela faz:**
- Exibe dados do consumidor (nome, e-mail, telefone)
- Permite editar dados
- Gerencia endereços salvos
- Botão de logout

**Endpoints:**

#### `GET /api/app/perfil`

**Headers:** `Authorization: Bearer <token>`

**Retorno (200):**
```json
{
  "id": "uuid",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "telefone": "27999999999"
}
```

---

#### `PUT /api/app/perfil`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nome": "João da Silva Santos",
  "telefone": "27988888888"
}
```

**Retorno (200):**
```json
{
  "id": "uuid",
  "nome": "João da Silva Santos",
  "email": "joao@email.com",
  "telefone": "27988888888"
}
```

---

#### `GET /api/app/enderecos`

**Headers:** `Authorization: Bearer <token>`

**Retorno (200):**
```json
[
  {
    "id": "uuid",
    "label": "Casa",
    "logradouro": "Rua X",
    "numero": "123",
    "bairro": "Manguinhos",
    "cidade": "Serra",
    "estado": "ES",
    "cep": "29160-000",
    "complemento": "Apto 101",
    "principal": true
  }
]
```

---

#### `POST /api/app/enderecos`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "label": "Trabalho",
  "logradouro": "Av. Y",
  "numero": "456",
  "bairro": "Laranjeiras",
  "cidade": "Serra",
  "estado": "ES",
  "cep": "29165-000",
  "complemento": "Sala 3"
}
```

**Retorno (201):**
```json
{
  "id": "uuid",
  "label": "Trabalho",
  "logradouro": "Av. Y",
  "numero": "456",
  "bairro": "Laranjeiras",
  "cidade": "Serra",
  "estado": "ES",
  "cep": "29165-000",
  "complemento": "Sala 3"
}
```

---

#### `DELETE /api/app/enderecos/:id`

**Headers:** `Authorization: Bearer <token>`

**Retorno (204):** Sem conteúdo

---

## 3. Endpoints Existentes que Podem Ser Reaproveitados

A API de gestão já possui alguns endpoints que podem ser úteis ou adaptados:

| Endpoint Existente | Uso no App | Observação |
|--------------------|------------|------------|
| `GET /api/publico/associados/ativos` | Dados de pescadores | Pode alimentar a seção "Nossos Pescadores" da vitrine |
| `GET /api/publico/pescador/:id/ativo` | Verificar se pescador pode vender | Útil para validação |
| `GET /api/publico/pescador/:id/status` | Status do pescador | Útil para vitrine |
| `POST /auth/login` | Login do consumidor | **Criar versão separada** — login do app é diferente do login do painel admin |
| `GET /auth/eu` | Dados do usuário logado | **Criar versão separada** — consumidor não é associado |

> **Importante:** Não misture autenticação do painel administrativo com autenticação do app. São públicos diferentes. Crie uma tabela `consumidores` separada de `associados`.

---

## 4. Modelo de Dados SUGERIDO (Tabelas Novas)

Para o app funcionar, o backend precisará de pelo menos estas tabelas novas:

### `consumidores`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `nome` | VARCHAR | Nome completo |
| `email` | VARCHAR | E-mail (único) |
| `telefone` | VARCHAR | Telefone |
| `senha_hash` | VARCHAR | Senha criptografada |
| `criado_em` | TIMESTAMP | Data de cadastro |

### `enderecos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `consumidor_id` | UUID | FK → consumidores |
| `label` | VARCHAR | "Casa", "Trabalho", etc. |
| `logradouro` | VARCHAR | Rua, avenida |
| `numero` | VARCHAR | Número |
| `bairro` | VARCHAR | Bairro |
| `cidade` | VARCHAR | Cidade |
| `estado` | VARCHAR | Estado |
| `cep` | VARCHAR | CEP |
| `complemento` | VARCHAR | Apto, sala, etc. |
| `principal` | BOOLEAN | Endereço principal do consumidor |

### `pedidos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `consumidor_id` | UUID | FK → consumidores |
| `status` | ENUM | confirmado, em_preparo, a_caminho, entregue, cancelado |
| `endereco_entrega` | TEXT | Endereço completo |
| `janela_entrega` | VARCHAR | Faixa de horário |
| `frete` | DECIMAL | Valor do frete |
| `valor_total` | DECIMAL | Valor total do pedido |
| `forma_pagamento` | ENUM | pix, cartao |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Última atualização |

### `pedido_itens`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `pedido_id` | UUID | FK → pedidos |
| `produto_id` | UUID | FK → produtos/estoque |
| `corte` | ENUM | inteiro, limpo, file |
| `peso_kg` | DECIMAL | Peso solicitado |
| `preco_unitario` | DECIMAL | Preço por kg no momento |

### `produtos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Chave primária |
| `pescador_id` | UUID | FK → associados |
| `especie` | VARCHAR | Nome da espécie |
| `foto` | VARCHAR | URL da imagem |
| `preco_por_kg` | DECIMAL | Preço atual |
| `peso_disponivel` | DECIMAL | Kg disponíveis |
| `cortes_disponiveis` | JSON | ["inteiro", "limpo", "file"] |
| `categoria` | VARCHAR | ["peixe", "crustaceo"] |
| `atualizado_em` | TIMESTAMP | Última atualização |

---

## 5. Checklist de Prioridades para o MVP

### Fase 1 — Essencial (sem isso o app não funciona)
- [ ] `POST /api/app/auth/cadastro`
- [ ] `POST /api/app/auth/login`
- [ ] `GET /api/app/auth/eu`
- [ ] `GET /api/app/vitrine`
- [ ] `GET /api/app/produtos/:id`
- [ ] `POST /api/app/pedidos`
- [ ] `GET /api/app/pedidos/:id`
- [ ] `GET /api/app/pedidos/meus`

### Fase 2 — Importante (melhora a experiência)
- [ ] `GET /api/app/produtos` (busca e filtros)
- [ ] `POST /api/app/frete/calcular`
- [ ] `GET /api/app/perfil`
- [ ] `PUT /api/app/perfil`
- [ ] `GET /api/app/enderecos`
- [ ] `POST /api/app/enderecos`

### Fase 3 — Nice to have (pode ficar para depois)
- [ ] `POST /api/app/pagamento/pix`
- [ ] `POST /api/app/pagamento/cartao`
- [ ] `DELETE /api/app/enderecos/:id`

---

## 6. Notas para a Equipe de Backend

1. **Separar app de gestão:** A API do app (`/api/app/...`) deve ser independente da API de gestão (`/api/...`). São públicos diferentes.
2. **JWT para autenticação:** Use o mesmo padrão de JWT que já existe no `/auth/login` da gestão, mas com tabela separada de consumidores.

---

## 7. Fluxo Completo de Dados

```
CONSUMIDOR (App)                          BACKEND (API)
      │                                        │
      │  POST /api/app/auth/cadastro           │
      ├───────────────────────────────────────►│
      │                                        │ Cria consumidor no DB
      │  ←── token JWT + dados                 │
      │◄───────────────────────────────────────
      │                                        │
      │  GET /api/app/vitrine                  │
      ├───────────────────────────────────────►│
      │  ←── banner + pescadores + produtos    │
      │◄───────────────────────────────────────┤
      │                                        │
      │  GET /api/app/produtos?busca=robalo    │
      ├───────────────────────────────────────►│
      │  ←── produtos filtrados                │
      │◄───────────────────────────────────────┤
      │                                        │
      │  GET /api/app/produtos/:id             │
      ├───────────────────────────────────────►│
      │  ←── detalhes do produto               │
      │◄───────────────────────────────────────┤
      │                                        │
      │  (carrinho é local no app)             │
      │                                        │
      │  POST /api/app/frete/calcular          │
      ├───────────────────────────────────────►│
      │  ←── valor do frete                    │
      │───────────────────────────────────────┤
      │                                        │
      │  POST /api/app/pedidos                 │
      ├───────────────────────────────────────►│
      │                                        │ Cria pedido + gera Pix
      │  ←── pedido criado + QR Code Pix       │
      │◄───────────────────────────────────────┤
      │                                        │
      │  GET /api/app/pedidos/:id (polling)    │
      ├───────────────────────────────────────►│
      │  ←── status atualizado                 │
      │◄───────────────────────────────────────┤
      │                                        │
```

---

*Documento gerado em 19/05/2026 — Maré de Manguinhos App*
