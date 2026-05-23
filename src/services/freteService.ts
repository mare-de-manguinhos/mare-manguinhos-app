import api from './api';

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
  calcular: (params: FreteParams) =>
    api.post<FreteResponse>('/api/app/frete/calcular', params),
};
