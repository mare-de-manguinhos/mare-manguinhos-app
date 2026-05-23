export type AppTabParamList = {
  Vitrine: undefined;
  Carrinho: undefined;
  Pedidos: undefined;
  Perfil: undefined;
};

export type VitrineStackParamList = {
  Vitrine: undefined;
  Produto: { produtoId: string };
};

export type PedidosStackParamList = {
  Historico: undefined;
  Acompanhamento: { pedidoId: string };
};
