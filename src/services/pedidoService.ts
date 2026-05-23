import api from './api';
import { Pedido, DadosCheckout } from '../types';

export const pedidoService = {
  criar: (dados: DadosCheckout) =>
    api.post<Pedido>('/api/app/pedidos', dados),

  buscarStatus: (id: string) =>
    api.get<Pedido>(`/api/app/pedidos/${id}`),

  listarHistorico: (params?: { pagina?: number; limite?: number }) =>
    api.get<{ pedidos: Pedido[]; totalPaginas: number; paginaAtual: number }>('/api/app/pedidos/meus', { params }),
};
