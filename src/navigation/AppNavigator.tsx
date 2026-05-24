import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppTabParamList } from './types';
import TabIcon from '../components/shared/TabIcon';
import VitrineStack from './VitrineStack';
import CarrinhoStack from './CarrinhoStack';
import PedidosStack from './PedidosStack';
import PerfilScreen from '../screens/perfil/PerfilScreen';
import { useCarrinhoStore } from '../store/carrinhoStore';
import CarrinhoScreen from '../screens/carrinho/CarrinhoScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppNavigator() {
  const badgeCount = useCarrinhoStore((s) => s.itens.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon name={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarActiveTintColor: '#3A9D8F',
        tabBarInactiveTintColor: '#6B655A',
        tabBarStyle: {
          backgroundColor: '#FBF6EF',
          borderTopWidth: 1,
          borderTopColor: '#D6CFC4',
          paddingBottom: 16,
          paddingTop: 8,
          height: 72,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Vitrine" component={VitrineStack} />
      <Tab.Screen
        name="Carrinho"
        component={CarrinhoScreen}
        options={{ tabBarBadge: badgeCount > 0 ? badgeCount : undefined }}
      />
      <Tab.Screen name="Pedidos" component={PedidosStack} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
