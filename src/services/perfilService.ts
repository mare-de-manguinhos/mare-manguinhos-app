import api from './api';
import { Usuario, Endereco, EnderecoInput } from '../types';

export const perfilService = {
  buscar: () => api.get<Usuario>('/api/app/perfil'),

  atualizar: (dados: Partial<Pick<Usuario, 'nome' | 'telefone'>>) =>
    api.put<Usuario>('/api/app/perfil', dados),

  listarEnderecos: () => api.get<Endereco[]>('/api/app/enderecos'),

  criarEndereco: (dados: EnderecoInput) =>
    api.post<Endereco>('/api/app/enderecos', dados),

  removerEndereco: (id: string) =>
    api.delete(`/api/app/enderecos/${id}`),
};
