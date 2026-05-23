import React, { useState } from 'react';
import { Text, Pressable, Image, View } from 'react-native';
import { Pescador } from '../../types';

interface Props {
  pescador: Pescador;
  selected: boolean;
  onPress: () => void;
}

export default function PescadorCard({ pescador, selected, onPress }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Filtrar por ${pescador.nome}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className="items-center mr-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View
        className="h-20 w-20 items-center justify-center overflow-hidden rounded-full"
        style={{ borderWidth: selected ? 4 : 0, borderColor: selected ? '#1A5F7A' : 'transparent' }}
      >
        {imageError ? (
          <View className="h-full w-full items-center justify-center bg-pedra-mar/30 rounded-full">
            <Text className="text-mar text-2xl font-bold">{pescador.nome.charAt(0)}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: pescador.foto }}
            className="h-full w-full rounded-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
            accessibilityLabel={pescador.nome}
          />
        )}
      </View>
      <Text
        className="text-ardosia text-sm mt-1.5 text-center font-medium"
        numberOfLines={1}
        style={{ maxWidth: 96 }}
      >
        {pescador.nome}
      </Text>
    </Pressable>
  );
}
