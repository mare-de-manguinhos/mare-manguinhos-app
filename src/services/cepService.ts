interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface CepData {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export async function buscarCep(cep: string): Promise<CepData | null> {
  const raw = cep.replace(/\D/g, '');
  if (raw.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
    const data: ViaCEPResponse = await response.json();

    if (data.erro) return null;

    return {
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    };
  } catch {
    return null;
  }
}
