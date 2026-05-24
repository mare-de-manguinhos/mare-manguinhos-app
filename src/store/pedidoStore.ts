import { create } from 'zustand';
import { PedidoStore, DadosCheckout } from '../types';
import { pedidoService } from '../services/pedidoService';
import { useCarrinhoStore } from './carrinhoStore';

export const usePedidoStore = create<PedidoStore>((set) => ({
  pedidoAtivo: null,
  historico: [],

  fazerPedido: async (checkout: DadosCheckout) => {
    const resp = await pedidoService.criar(checkout);
    const pedido = resp.data;
    set({ pedidoAtivo: pedido });
    useCarrinhoStore.getState().limpar();
  },

  atualizarStatus: async (pedidoId: string) => {
    const resp = await pedidoService.buscarStatus(pedidoId);
    set({ pedidoAtivo: resp.data });
  },
}));
