import api from './api';
import { VitrineData, Produto } from '../types';
import { vitrineDataMock } from './vitrineDataMock';

const USE_MOCK = true;

export const vitrineService = {
  listarVitrine: async (): Promise<VitrineData> => {
    if (USE_MOCK) {
      return vitrineDataMock;
    }
    const { data } = await api.get<VitrineData>('/api/app/vitrine');
    return data;
  },

  listarProdutos: (params?: { busca?: string; categoria?: string; pescador_id?: string }) =>
    api.get<Produto[]>('/api/app/produtos', { params }),

  buscarProduto: (id: string) => api.get<Produto>(`/api/app/produtos/${id}`),
};
