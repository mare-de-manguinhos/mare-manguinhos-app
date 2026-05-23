import React from 'react';
import { Text, Pressable } from 'react-native';
import { CategoriaVitrine } from '../../types';

interface Props {
  categoria: CategoriaVitrine;
  active: boolean;
  onPress: () => void;
}

export default function CategoriaChip({ categoria, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Filtrar por ${categoria.nome}`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`mr-2 rounded-full px-5 py-3 ${active ? 'bg-terracota' : 'bg-espuma border border-pedra-mar'}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Text className={`text-base font-semibold ${active ? 'text-espuma' : 'text-marinha'}`}>
        {categoria.nome}
      </Text>
    </Pressable>
  );
}
