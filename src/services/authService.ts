import api from './api';
import { RegisterPayload } from '../types';

export const authService = {
  cadastro: (dados: RegisterPayload) =>
    api.post<{ id: string; nome: string; email: string; token: string }>('/api/app/auth/cadastro', {
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      senha: dados.password,
    }),

  login: (email: string, senha: string) =>
    api.post<{ id: string; nome: string; email: string; token: string }>('/api/app/auth/login', {
      email,
      senha,
    }),

  eu: () => api.get<{ id: string; nome: string; email: string; telefone: string; criadoEm: string }>('/api/app/auth/eu'),
};
