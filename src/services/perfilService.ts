import api from './api';
import { Usuario, Endereco, EnderecoInput } from '../types';

export const perfilService = {
  buscar: async () => {
    const { data } = await api.get<Usuario>('/api/app/perfil');
    return data;
  },

  atualizar: async (dados: Partial<Pick<Usuario, 'nome' | 'telefone'>>) => {
    const { data } = await api.put<Usuario>('/api/app/perfil', dados);
    return data;
  },

  listarEnderecos: async () => {
    const { data } = await api.get<Endereco[]>('/api/app/enderecos');
    return data;
  },

  criarEndereco: async (dados: EnderecoInput) => {
    const { data } = await api.post<Endereco>('/api/app/enderecos', dados);
    return data;
  },

  removerEndereco: async (id: string) => {
    await api.delete(`/api/app/enderecos/${id}`);
  },
};
