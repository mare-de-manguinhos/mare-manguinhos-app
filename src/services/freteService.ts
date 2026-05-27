import api from './api';

export const USE_MOCK_FRETE = true;

interface FreteParams {
  endereco: string;
  latitude?: number;
  longitude?: number;
}

interface FreteResponse {
  valorFrete: number;
  prazoEstimadoMinutos: number;
}

export const freteService = {
  calcular: async (params: FreteParams): Promise<{ data: FreteResponse }> => {
    if (USE_MOCK_FRETE) {
      await new Promise<void>((r) => setTimeout(r, 900));
      return { data: { valorFrete: 8.5, prazoEstimadoMinutos: 45 } };
    }
    return api.post<FreteResponse>('/api/app/frete/calcular', params);
  },
};
