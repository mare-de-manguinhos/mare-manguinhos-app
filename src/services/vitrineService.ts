import api from './api';
import type { VitrineData, Produto } from '../types';

export const vitrineService = {
  listarVitrine: async (): Promise<VitrineData> => {
    const { data } = await api.get<VitrineData>('/api/app/vitrine');
    return data;
  },

  async listarProdutos(params?: { busca?: string; categoria?: string; pescador_id?: string }): Promise<Produto[]> {
    const { data } = await api.get<Produto[]>('/api/app/produtos', { params });
    return data;
  },

  async buscarProduto(id: string): Promise<Produto> {
    const { data } = await api.get<Produto>(`/api/app/produtos/${id}`);
    return data;
  },
};
