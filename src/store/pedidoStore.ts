import { create } from 'zustand';
import { Pedido, DadosCheckout } from '../types';
import { pedidoService } from '../services/pedidoService';

interface PedidoStoreState {
  pedidoAtivo: Pedido | null;
  historico: Pedido[];
  loading: boolean;
  fazerPedido: (dados: DadosCheckout) => Promise<void>;
  buscarStatus: (pedidoId: string) => Promise<void>;
  listarHistorico: () => Promise<void>;
}

export const usePedidoStore = create<PedidoStoreState>((set) => ({
  pedidoAtivo: null,
  historico: [],
  loading: false,

  fazerPedido: async (dados) => {
    set({ loading: true });
    try {
      const { data } = await pedidoService.criar(dados);
      set({ pedidoAtivo: data });
    } finally {
      set({ loading: false });
    }
  },

  buscarStatus: async (pedidoId) => {
    set({ loading: true });
    try {
      const { data } = await pedidoService.buscarStatus(pedidoId);
      set({ pedidoAtivo: data });
    } finally {
      set({ loading: false });
    }
  },

  listarHistorico: async () => {
    set({ loading: true });
    try {
      const { data } = await pedidoService.listarHistorico();
      set({ historico: data.pedidos });
    } finally {
      set({ loading: false });
    }
  },
}));
