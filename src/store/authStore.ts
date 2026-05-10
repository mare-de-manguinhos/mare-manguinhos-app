import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthStore, RegisterPayload } from '../types';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,

  login: async (email: string, senha: string) => {
    // TODO: substituir mock por authService.login(email, senha)
    await new Promise<void>((r) => setTimeout(r, 1500));
    const mockToken = 'mock-jwt-token';
    const mockUsuario = { id: '1', nome: 'Usuário Teste', email, telefone: '' };
    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    set({ token: mockToken, usuario: mockUsuario });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, usuario: null });
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
    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    set({ token: mockToken, usuario: mockUsuario });
  },
}));
