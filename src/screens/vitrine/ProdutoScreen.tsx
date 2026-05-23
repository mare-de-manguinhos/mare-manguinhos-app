import React from 'react';
import { View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VitrineStackParamList } from '../../navigation/types';

type ProdutoRoute = RouteProp<VitrineStackParamList, 'Produto'>;

export default function ProdutoScreen() {
  const route = useRoute<ProdutoRoute>();
  const { produtoId } = route.params;

  return (
    <View className="flex-1 items-center justify-center bg-areia px-6">
      <Text className="text-ardosia text-2xl font-bold mb-2">Detalhes do Produto</Text>
      <View className="rounded-2xl bg-espuma px-6 py-4 border border-pedra-mar">
        <Text className="text-marinha text-sm">ID do Produto</Text>
        <Text className="text-ardosia text-lg font-mono font-semibold mt-1">{produtoId}</Text>
      </View>
    </View>
  );
}
