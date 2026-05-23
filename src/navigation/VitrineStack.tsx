import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { VitrineStackParamList } from './types';
import VitrineScreen from '../screens/vitrine/VitrineScreen';
import ProdutoScreen from '../screens/vitrine/ProdutoScreen';

const Stack = createStackNavigator<VitrineStackParamList>();

export default function VitrineStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Vitrine" component={VitrineScreen} />
      <Stack.Screen name="Produto" component={ProdutoScreen} />
    </Stack.Navigator>
  );
}
