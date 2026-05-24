import api from './api';
import { VitrineData, Produto } from '../types';
import { vitrineDataMock, gerarProdutoDetalhado } from './vitrineDataMock';

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

  buscarProduto: async (id: string): Promise<Produto> => {
    if (USE_MOCK) {
      const mock = gerarProdutoDetalhado(id);
      if (!mock) throw new Error('Produto não encontrado');
      return mock;
    }
    const { data } = await api.get<Produto>(`/api/app/produtos/${id}`);
    return data;
  },
};
