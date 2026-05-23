import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabIconProps {
  readonly name: 'Vitrine' | 'Carrinho' | 'Pedidos' | 'Perfil';
  readonly focused: boolean;
  readonly color: string;
  readonly size: number;
}

const iconMap: Record<TabIconProps['name'], { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Vitrine: { active: 'storefront', inactive: 'storefront-outline' },
  Carrinho: { active: 'cart', inactive: 'cart-outline' },
  Pedidos: { active: 'receipt', inactive: 'receipt-outline' },
  Perfil: { active: 'person', inactive: 'person-outline' },
};

export default function TabIcon({ name, focused, color, size }: TabIconProps) {
  const icon = focused ? iconMap[name].active : iconMap[name].inactive;
  return <Ionicons name={icon} size={size} color={color} />;
}
