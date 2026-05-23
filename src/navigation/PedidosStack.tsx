import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PedidosStackParamList } from './types';
import HistoricoScreen from '../screens/pedido/HistoricoScreen';
import AcompanhamentoScreen from '../screens/pedido/AcompanhamentoScreen';

const Stack = createStackNavigator<PedidosStackParamList>();

export default function PedidosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Historico" component={HistoricoScreen} />
      <Stack.Screen name="Acompanhamento" component={AcompanhamentoScreen} />
    </Stack.Navigator>
  );
}
