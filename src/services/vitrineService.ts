import api from './api';
import { Produto } from '../types';

export const vitrineService = {
  listarVitrine: () => api.get('/api/app/vitrine'),

  listarProdutos: (params?: { busca?: string; categoria?: string; pescador_id?: string }) =>
    api.get<Produto[]>('/api/app/produtos', { params }),

  buscarProduto: (id: string) => api.get<Produto>(`/api/app/produtos/${id}`),
};
