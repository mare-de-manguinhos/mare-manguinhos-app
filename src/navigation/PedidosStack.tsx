import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PedidosStackParamList } from './types';
import { defaultStackOptions } from './stackDefaults';
import HistoricoScreen from '../screens/pedido/HistoricoScreen';
import AcompanhamentoScreen from '../screens/pedido/AcompanhamentoScreen';

const Stack = createStackNavigator<PedidosStackParamList>();

export default function PedidosStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Meus Pedidos' }} />
      <Stack.Screen name="Acompanhamento" component={AcompanhamentoScreen} options={{ title: 'Acompanhamento' }} />
    </Stack.Navigator>
  );
}
