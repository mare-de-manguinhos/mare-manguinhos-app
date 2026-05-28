// ---------------------------------------------------------------------------
// Primitivos / Enums
// ---------------------------------------------------------------------------

export type Corte = 'inteiro' | 'limpo' | 'file';

export type Categoria = 'peixe' | 'crustaceo';

export type StatusPedido = 'confirmado' | 'em_preparo' | 'a_caminho' | 'entregue' | 'cancelado';

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
  telefone?: string;
}

export interface Produto {
  id: string;
  especie: string;
  foto: string;
  precoPorKg: number;
  pesoDisponivel: number; // em kg
  cortesDisponiveis: Corte[];
  badges?: string[];
  pescador: Pescador;
  categoria: Categoria;
  descricao?: string;
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
  atualizadoEm?: string;
}

export interface ItemPedidoInput {
  produtoId: string;
  corte: Corte;
  pesoKg: number;
}

export interface DadosCheckout {
  itens: ItemPedidoInput[];
  enderecoEntrega: string;
  janelaEntrega: string;
  formaPagamento: FormaPagamento;
  frete: number;
  valorTotal: number;
}

// ---------------------------------------------------------------------------
// Interfaces dos Stores (contratos para implementação com Zustand)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Vitrine Feature Types
// ---------------------------------------------------------------------------

export interface Banner {
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagem: string;
}

export interface ProdutoResumo {
  id: string;
  especie: string;
  foto: string;
  precoPorKg: number;
  pesoDisponivel: number;
  categoria: string;
  badges?: string[];
  pescador: {
    id: string;
    nome: string;
  };
}

export interface CategoriaVitrine {
  id: string;
  nome: string;
}

export interface VitrineData {
  banner?: Banner;
  pescadores: Pescador[];
  categorias: CategoriaVitrine[];
  produtos: ProdutoResumo[];
}

// ---------------------------------------------------------------------------
// Interfaces dos Stores (contratos para implementação com Zustand)
// ---------------------------------------------------------------------------

export interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  enderecoPrincipal: Endereco | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Auth Feature Types
// ---------------------------------------------------------------------------

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  telefone: string; // raw digits: "27999999999"
  password: string;
  endereco?: EnderecoInput;
}

export interface Endereco {
  id: string;
  label: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  principal: boolean;
}

export interface EnderecoInput {
  label?: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
  principal?: boolean;
}

export interface LoginFormState {
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  tentativasFalhas: number;
  errors: {
    email?: string;
    password?: string;
    geral?: string;
  };
}

export interface BasicFormState {
  nome: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  telefone: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  errors: {
    nome?: string;
    email?: string;
    confirmEmail?: string;
    password?: string;
    confirmPassword?: string;
    telefone?: string;
  };
}

export interface AddressFormState {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  loading: boolean;
  errors: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    geral?: string;
  };
}

export type RegisterStep = 1 | 2;

// ---------------------------------------------------------------------------
// Component Prop Interfaces
// ---------------------------------------------------------------------------

export interface AppButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly variant?: 'primary' | 'secondary' | 'outline';
  readonly accessibilityLabel: string;
}

export interface AppInputProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly placeholder?: string;
  readonly error?: string;
  readonly secureTextEntry?: boolean;
  readonly onToggleSecure?: () => void;
  readonly keyboardType?: import('react-native').KeyboardTypeOptions;
  readonly autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  readonly accessibilityLabel: string;
  readonly accessibilityHint?: string;
  readonly onBlur?: () => void;
  readonly editable?: boolean;
}

export interface CarrinhoStore {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto, corte: Corte, pesoKg: number) => void;
  removerItem: (produtoId: string, corte: Corte) => void;
  limpar: () => void;
  total: () => number;
}

export interface PedidoStore {
  pedidoAtivo: Pedido | null;
  historico: Pedido[];
  loading: boolean;
  fazerPedido: (checkout: DadosCheckout) => Promise<void>;
  atualizarStatus: (pedidoId: string) => Promise<void>;
  listarHistorico: () => Promise<void>;
  limpar: () => void;
}


