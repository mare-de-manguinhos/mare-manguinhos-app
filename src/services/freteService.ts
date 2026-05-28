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
  calcular: async (params: FreteParams) => {
    const { data } = await api.post<FreteResponse>('/api/app/frete/calcular', params);
    return data;
  },
};
