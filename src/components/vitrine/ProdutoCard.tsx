import React, { useState } from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProdutoResumo } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const badgeColors: Record<string, string> = {
  Hoje: '#3A9E6A',
  Premium: '#F2A23A',
  Favorito: '#E05A5A',
};

interface Props {
  produto: ProdutoResumo;
  onPress?: () => void;
}

export default function ProdutoCard({ produto, onPress }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={`${produto.especie}, R$ ${produto.precoPorKg.toFixed(2)} por kg`}
      accessibilityRole="button"
      className="mb-4 overflow-hidden rounded-2xl bg-espuma"
      style={{
        width: CARD_WIDTH,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="relative h-32 w-full">
        {imageError ? (
          <View className="h-full w-full items-center justify-center bg-pedra-mar/20">
            <Ionicons name="fish-outline" size={36} color="#5A7A87" />
          </View>
        ) : (
          <Image
            source={{ uri: produto.foto }}
            className="h-full w-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
            accessibilityLabel={produto.especie}
          />
        )}
        {produto.badges && produto.badges.length > 0 && (
          <View className="absolute top-2 left-2 flex-row flex-wrap gap-1">
            {produto.badges.map((badge) => (
              <View
                key={badge}
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: badgeColors[badge] || '#5A7A87' }}
              >
                <Text className="text-espuma text-xs font-semibold">{badge}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View className="px-3 py-3">
        <Text className="text-ardosia text-base font-bold" numberOfLines={1}>
          {produto.especie}
        </Text>
        <Text className="text-mar text-lg font-bold mt-1">
          R$ {produto.precoPorKg.toFixed(2)}
          <Text className="text-marinha text-sm font-normal"> /kg</Text>
        </Text>
        <Text className="text-marinha text-sm mt-1">
          {produto.pesoDisponivel}kg disponível
        </Text>
        <Text className="text-marinha text-xs mt-1.5">
          {produto.pescador.nome}
        </Text>
      </View>
    </Pressable>
  );
}
