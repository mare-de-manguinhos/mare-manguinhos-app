import api from './api';
import type { Pedido, DadosCheckout } from '../types';

export const pedidoService = {
  async criar(dados: DadosCheckout): Promise<Pedido> {
    const { data } = await api.post<Pedido>('/api/app/pedidos', dados);
    return data;
  },

  async buscarStatus(id: string): Promise<Pedido> {
    const { data } = await api.get<Pedido>(`/api/app/pedidos/${id}`);
    return data;
  },

  async listarHistorico(params?: { pagina?: number; limite?: number }): Promise<{ pedidos: Pedido[]; totalPaginas: number; paginaAtual: number }> {
    const { data } = await api.get<{ pedidos: Pedido[]; totalPaginas: number; paginaAtual: number }>('/api/app/pedidos/meus', { params });
    return data;
  },
};
