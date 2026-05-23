import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthStore, Endereco, RegisterPayload } from '../types';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,
  enderecoPrincipal: null,

  login: async (email: string, senha: string) => {
    // TODO: substituir mock por authService.login(email, senha) em services/authService.ts
    await new Promise<void>((r) => setTimeout(r, 1500));
    const mockToken = 'mock-jwt-token';
    const mockUsuario = { id: '1', nome: 'Alex Rossoni', email, telefone: '' };
    const mockEndereco: Endereco = {
      id: '1',
      label: 'Casa',
      logradouro: 'Rua dos Carros',
      numero: '123',
      bairro: 'Manguinhos',
      cidade: 'Serra',
      estado: 'ES',
      cep: '29160-000',
      principal: true,
    };
    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    set({ token: mockToken, usuario: mockUsuario, enderecoPrincipal: mockEndereco });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, usuario: null, enderecoPrincipal: null });
  },

  register: async (payload: RegisterPayload) => {
    // TODO: substituir mock por authService.register(payload)
    await new Promise<void>((r) => setTimeout(r, 1500));
    const mockToken = 'mock-jwt-token';
    const mockUsuario = {
      id: '1',
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone,
    };
    const mockEndereco: Endereco = payload.endereco
      ? { id: '1', label: 'Casa', ...payload.endereco, principal: true }
      : {
          id: '1',
          label: 'Casa',
          logradouro: 'Rua das Flores',
          numero: '123',
          bairro: 'Manguinhos',
          cidade: 'Serra',
          estado: 'ES',
          cep: '29160-000',
          principal: true,
        };
    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    set({ token: mockToken, usuario: mockUsuario, enderecoPrincipal: mockEndereco });
  },
}));
