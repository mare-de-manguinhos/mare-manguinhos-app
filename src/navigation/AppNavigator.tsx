import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from './types';
import TabIcon from '../components/shared/TabIcon';
import VitrineStack from './VitrineStack';
import CarrinhoScreen from '../screens/carrinho/CarrinhoScreen';
import PedidosStack from './PedidosStack';
import PerfilScreen from '../screens/perfil/PerfilScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon name={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#2E86AB',
        tabBarInactiveTintColor: '#5A7A87',
        tabBarStyle: {
          backgroundColor: '#FDF6EC',
          borderTopWidth: 1,
          borderTopColor: '#B8D4DC',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Vitrine" component={VitrineStack} />
      <Tab.Screen name="Carrinho" component={CarrinhoScreen} />
      <Tab.Screen name="Pedidos" component={PedidosStack} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
