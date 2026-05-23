import api from './api';

export const pagamentoService = {
  gerarPix: (pedidoId: string, valor: number) =>
    api.post<{ qrCode: string; codigo: string; expiraEm: string }>('/api/app/pagamento/pix', {
      pedidoId,
      valor,
    }),

  processarCartao: (pedidoId: string, valor: number, tokenCartao: string) =>
    api.post<{ status: string; transacaoId: string }>('/api/app/pagamento/cartao', {
      pedidoId,
      valor,
      tokenCartao,
    }),
};
