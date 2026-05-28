import api from './api';
import { RegisterPayload } from '../types';

export const authService = {
  cadastro: async (dados: RegisterPayload) => {
    const { data } = await api.post<{ id: string; nome: string; email: string; token: string }>('/api/app/auth/cadastro', {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      senha: dados.password,
    });
    return data;
  },

  login: async (email: string, senha: string) => {
    const { data } = await api.post<{ id: string; nome: string; email: string; token: string }>('/api/app/auth/login', {
      email,
      senha,
    });
    return data;
  },

  eu: async () => {
    const { data } = await api.get<{ id: string; nome: string; email: string; telefone: string; criadoEm: string }>('/api/app/auth/eu');
    return data;
  },
};
