// ---------------------------------------------------------------------------
// Primitivos / Enums
// ---------------------------------------------------------------------------

export type Corte = 'inteiro' | 'limpo' | 'file';

export type StatusPedido = 'confirmado' | 'em_preparo' | 'a_caminho' | 'entregue';

export type FormaPagamento = 'pix' | 'cartao';

// ---------------------------------------------------------------------------
// Entidades
// ---------------------------------------------------------------------------

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface Pescador {
  id: string;
  nome: string;
  foto: string;
}

export interface Produto {
  id: string;
  especie: string;
  foto: string;
  precoPorKg: number;
  pesoDisponivel: number; // em kg
  cortesDisponiveis: Corte[];
  pescador: Pescador;
}

export interface ItemCarrinho {
  produto: Produto;
  corte: Corte;
  pesoKg: number;
}

export interface Pedido {
  id: string;
  itens: ItemCarrinho[];
  status: StatusPedido;
  enderecoEntrega: string;
  janelaEntrega: string;
  frete: number;
  valorTotal: number;
  formaPagamento: FormaPagamento;
  criadoEm: string;
}

export interface DadosCheckout {
  itens: ItemCarrinho[];
  enderecoEntrega: string;
  janelaEntrega: string;
  formaPagamento: FormaPagamento;
}

// ---------------------------------------------------------------------------
// Interfaces dos Stores (contratos para implementação com Zustand)
// ---------------------------------------------------------------------------

export interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

export interface CarrinhoStore {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto, corte: Corte, pesoKg: number) => void;
  removerItem: (produtoId: string) => void;
  limpar: () => void;
  total: () => number;
}

export interface PedidoStore {
  pedidoAtivo: Pedido | null;
  historico: Pedido[];
  fazerPedido: (checkout: DadosCheckout) => Promise<void>;
  atualizarStatus: (pedidoId: string) => Promise<void>;
}
