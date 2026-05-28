import api from './api';

export const pagamentoService = {
  gerarPix: async (pedidoId: string, valor: number) => {
    const { data } = await api.post<{ qrCode: string; codigo: string; expiraEm: string }>('/api/app/pagamento/pix', {
      pedidoId,
      valor,
    });
    return data;
  },

  processarCartao: async (pedidoId: string, valor: number, tokenCartao: string) => {
    const { data } = await api.post<{ status: string; transacaoId: string }>('/api/app/pagamento/cartao', {
      pedidoId,
      valor,
      tokenCartao,
    });
    return data;
  },
};
