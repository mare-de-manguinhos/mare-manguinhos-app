import { create } from 'zustand';
import { PedidoStore, DadosCheckout } from '../types';
import { pedidoService } from '../services/pedidoService';
import { useCarrinhoStore } from './carrinhoStore';

export const usePedidoStore = create<PedidoStore>((set) => ({
  pedidoAtivo: null,
  historico: [],
  loading: false,

  fazerPedido: async (checkout: DadosCheckout) => {
    set({ loading: true });
    try {
      const resp = await pedidoService.criar(checkout);
      set({ pedidoAtivo: resp.data });
      useCarrinhoStore.getState().limpar();
    } finally {
      set({ loading: false });
    }
  },

  atualizarStatus: async (pedidoId: string) => {
    set({ loading: true });
    try {
      const resp = await pedidoService.buscarStatus(pedidoId);
      set({ pedidoAtivo: resp.data });
    } finally {
      set({ loading: false });
    }
  },

  listarHistorico: async () => {
    set({ loading: true });
    try {
      const resp = await pedidoService.listarHistorico();
      set({ historico: resp.data.pedidos });
    } finally {
      set({ loading: false });
    }
  },
}));
