import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { Banner } from '../../types';

const { width } = Dimensions.get('window');

interface Props {
  banner: Banner;
}

export default function VitrineBanner({ banner }: Props) {
  return (
    <View className="mx-4 mb-4 overflow-hidden rounded-b-2xl" style={{ height: 180 }}>
      <Image
        source={{ uri: banner.imagem }}
        className="h-full w-full"
        resizeMode="cover"
        accessibilityLabel={`Banner: ${banner.titulo}`}
      />
      <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-4 py-3">
        <Text className="text-espuma text-xl font-bold">{banner.titulo}</Text>
        <Text className="text-espuma/90 text-base">{banner.subtitulo}</Text>
        <Text className="text-areia text-sm mt-1">{banner.descricao}</Text>
      </View>
    </View>
  );
}
