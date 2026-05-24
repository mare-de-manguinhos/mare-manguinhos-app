import { Pedido, DadosCheckout } from '../types';

function gerarId(): string {
  return `ped-${Math.random().toString(36).slice(2, 8)}`;
}

function gerarDataOffset(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(10 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60));
  return d.toISOString();
}

export const pedidosMock: Pedido[] = [
  {
    id: gerarId(),
    status: 'entregue',
    itens: [
      {
        produto: {
          id: 'prod-001',
          especie: 'Robalo',
          foto: 'https://loremflickr.com/400/300/seafood?seed=robalo',
          precoPorKg: 45.0,
          pesoDisponivel: 12.5,
          cortesDisponiveis: ['inteiro', 'limpo', 'file'],
          pescador: { id: 'pesc-001', nome: 'Sr. Antônio', foto: 'https://i.pravatar.cc/150?u=antonio' },
          categoria: 'peixe',
        },
        corte: 'file',
        pesoKg: 1.5,
      },
    ],
    enderecoEntrega: 'Rua das Marés, 42, Manguinhos, Serra - ES',
    janelaEntrega: '14:00-16:00',
    frete: 8.50,
    valorTotal: 76.00,
    formaPagamento: 'pix',
    criadoEm: gerarDataOffset(5),
  },
  {
    id: gerarId(),
    status: 'em_preparo',
    itens: [
      {
        produto: {
          id: 'prod-002',
          especie: 'Camarão Rosa',
          foto: 'https://loremflickr.com/400/300/crab?seed=camarao',
          precoPorKg: 65.0,
          pesoDisponivel: 5.0,
          cortesDisponiveis: ['inteiro', 'limpo'],
          pescador: { id: 'pesc-002', nome: 'D. Marlene', foto: 'https://i.pravatar.cc/150?u=marlene' },
          categoria: 'crustaceo',
        },
        corte: 'inteiro',
        pesoKg: 1.0,
      },
    ],
    enderecoEntrega: 'Av. Beira-Mar, 100, Manguinhos, Serra - ES',
    janelaEntrega: '10:00-12:00',
    frete: 0,
    valorTotal: 65.00,
    formaPagamento: 'cartao',
    criadoEm: gerarDataOffset(1),
  },
  {
    id: gerarId(),
    status: 'confirmado',
    itens: [
      {
        produto: {
          id: 'prod-003',
          especie: 'Tilápia',
          foto: 'https://loremflickr.com/400/300/seafood?seed=tilapia',
          precoPorKg: 32.0,
          pesoDisponivel: 20.0,
          cortesDisponiveis: ['inteiro', 'limpo', 'file'],
          pescador: { id: 'pesc-001', nome: 'Sr. Antônio', foto: 'https://i.pravatar.cc/150?u=antonio' },
          categoria: 'peixe',
        },
        corte: 'limpo',
        pesoKg: 2.0,
      },
      {
        produto: {
          id: 'prod-005',
          especie: 'Corvina',
          foto: 'https://loremflickr.com/400/300/seafood?seed=corvina',
          precoPorKg: 38.0,
          pesoDisponivel: 8.0,
          cortesDisponiveis: ['inteiro', 'file'],
          pescador: { id: 'pesc-003', nome: 'Seu José', foto: 'https://i.pravatar.cc/150?u=jose' },
          categoria: 'peixe',
        },
        corte: 'file',
        pesoKg: 1.0,
      },
    ],
    enderecoEntrega: 'Rua do Porto, 55, Manguinhos, Serra - ES',
    janelaEntrega: '14:00-16:00',
    frete: 8.50,
    valorTotal: 86.50,
    formaPagamento: 'pix',
    criadoEm: gerarDataOffset(0),
  },
];

export function buscarPedidoMock(id: string): Pedido | null {
  return pedidosMock.find((p) => p.id === id) ?? null;
}

export function criarPedidoMock(dados: DadosCheckout): Pedido {
  return {
    id: gerarId(),
    status: 'confirmado',
    itens: dados.itens,
    enderecoEntrega: dados.enderecoEntrega,
    janelaEntrega: dados.janelaEntrega,
    frete: dados.frete,
    valorTotal: dados.valorTotal,
    formaPagamento: dados.formaPagamento,
    criadoEm: new Date().toISOString(),
  };
}
