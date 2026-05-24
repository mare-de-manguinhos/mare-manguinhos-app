import { create } from 'zustand';
import { CarrinhoStore, Corte, Produto } from '../types';

export const useCarrinhoStore = create<CarrinhoStore>((set, get) => ({
  itens: [],

  adicionarItem: (produto: Produto, corte: Corte, pesoKg: number) =>
    set((state) => ({
      itens: [...state.itens, { produto, corte, pesoKg }],
    })),

  removerItem: (produtoId: string) =>
    set((state) => ({
      itens: state.itens.filter((i) => i.produto.id !== produtoId),
    })),

  limpar: () => set({ itens: [] }),

  total: () => get().itens.reduce((acc, i) => acc + i.produto.precoPorKg * i.pesoKg, 0),
}));
