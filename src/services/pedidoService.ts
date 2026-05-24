import api from './api';
import { Pedido, DadosCheckout } from '../types';
import { pedidosMock, buscarPedidoMock, criarPedidoMock } from './pedidoDataMock';

const USE_MOCK = true;

export const pedidoService = {
  criar: async (dados: DadosCheckout): Promise<{ data: Pedido }> => {
    if (USE_MOCK) {
      return { data: criarPedidoMock(dados) };
    }
    const { data } = await api.post<Pedido>('/api/app/pedidos', dados);
    return { data };
  },

  buscarStatus: async (id: string): Promise<{ data: Pedido }> => {
    if (USE_MOCK) {
      const pedido = buscarPedidoMock(id);
      if (!pedido) throw new Error('Pedido não encontrado');
      return { data: pedido };
    }
    const { data } = await api.get<Pedido>(`/api/app/pedidos/${id}`);
    return { data };
  },

  listarHistorico: async (params?: { pagina?: number; limite?: number }): Promise<{ data: { pedidos: Pedido[]; totalPaginas: number; paginaAtual: number } }> => {
    if (USE_MOCK) {
      return {
        data: {
          pedidos: pedidosMock,
          totalPaginas: 1,
          paginaAtual: 1,
        },
      };
    }
    const { data } = await api.get<{ pedidos: Pedido[]; totalPaginas: number; paginaAtual: number }>('/api/app/pedidos/meus', { params });
    return { data };
  },
};
