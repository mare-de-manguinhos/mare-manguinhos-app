import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CarrinhoStackParamList } from './types';
import { defaultStackOptions } from './stackDefaults';
import CarrinhoScreen from '../screens/carrinho/CarrinhoScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';

const Stack = createStackNavigator<CarrinhoStackParamList>();

export default function CarrinhoStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen
        name="CarrinhoLista"
        component={CarrinhoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
}
