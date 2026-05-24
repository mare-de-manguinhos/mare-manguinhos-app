import { create } from 'zustand';
import { CarrinhoStore, Corte, Produto } from '../types';

export const useCarrinhoStore = create<CarrinhoStore>((set, get) => ({
  itens: [],

  adicionarItem: (produto: Produto, corte: Corte, pesoKg: number) =>
    set((state) => {
      const existente = state.itens.find(
        (i) => i.produto.id === produto.id && i.corte === corte,
      );
      if (existente) {
        return {
          itens: state.itens.map((i) =>
            i.produto.id === produto.id && i.corte === corte
              ? { ...i, pesoKg: i.pesoKg + pesoKg }
              : i,
          ),
        };
      }
      return { itens: [...state.itens, { produto, corte, pesoKg }] };
    }),

  removerItem: (produtoId: string, corte: Corte) =>
    set((state) => ({
      itens: state.itens.filter(
        (i) => !(i.produto.id === produtoId && i.corte === corte),
      ),
    })),

  limpar: () => set({ itens: [] }),

  total: () => get().itens.reduce((acc, i) => acc + i.produto.precoPorKg * i.pesoKg, 0),
}));
