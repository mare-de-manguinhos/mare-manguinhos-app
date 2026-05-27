import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';
import { perfilService } from '../services/perfilService';
import type { AuthStore, RegisterPayload } from '../types';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,
  enderecoPrincipal: null,

  login: async (email: string, senha: string) => {
    const { data: authData } = await authService.login(email, senha);
    await SecureStore.setItemAsync(TOKEN_KEY, authData.token);
    set({ token: authData.token });

    const { data: perfil } = await authService.eu();
    const usuario = { id: perfil.id, nome: perfil.nome, email: perfil.email, telefone: perfil.telefone };

    let enderecoPrincipal = null;
    try {
      const { data: enderecos } = await perfilService.listarEnderecos();
      enderecoPrincipal = enderecos.find((e) => e.principal) ?? enderecos[0] ?? null;
    } catch {
      // Sem enderecos ainda — ok
    }

    set({ token: authData.token, usuario, enderecoPrincipal });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, usuario: null, enderecoPrincipal: null });
  },

  register: async (payload: RegisterPayload) => {
    const { data: authData } = await authService.cadastro(payload);
    await SecureStore.setItemAsync(TOKEN_KEY, authData.token);

    const usuario = { id: authData.id, nome: authData.nome, email: authData.email, telefone: payload.telefone };

    let enderecoPrincipal = null;
    if (payload.endereco) {
      try {
        const { data: endereco } = await perfilService.criarEndereco(payload.endereco);
        enderecoPrincipal = endereco;
      } catch {
        // Endereco opcional
      }
    }

    set({ token: authData.token, usuario, enderecoPrincipal });
  },
}));
