import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { VitrineStackParamList } from './types';
import { defaultStackOptions } from './stackDefaults';
import VitrineScreen from '../screens/vitrine/VitrineScreen';
import ProdutoScreen from '../screens/vitrine/ProdutoScreen';

const Stack = createStackNavigator<VitrineStackParamList>();

export default function VitrineStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen name="Vitrine" component={VitrineScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Produto" component={ProdutoScreen} options={{ title: 'Produto' }} />
    </Stack.Navigator>
  );
}
