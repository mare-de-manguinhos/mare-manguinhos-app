import React from 'react';
import { View, Text, Image } from 'react-native';

interface OceanHeaderProps {
  readonly title?: string;
  readonly subtitle?: string;
}

export default function OceanHeader({ title, subtitle }: OceanHeaderProps) {
  return (
    <View
      className="bg-terracota items-center px-6"
      style={{
        paddingTop: 56,
        paddingBottom: 44,
        borderBottomLeftRadius: 48,
        borderBottomRightRadius: 48,
        shadowColor: '#B3422E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
      }}
      accessibilityLabel="Cabeçalho decorativo do Maré de Manguinhos"
    >
      {/* Círculo decorativo atrás do logo */}
      <View
        className="bg-terracota-escuro items-center justify-center mb-3"
      />
      <Image
        source={require('../../../assets/Logo.png')}
        style={{ width: 84, height: 84, zIndex: 1 }}
        accessibilityLabel="Logo do Maré de Manguinhos"
        resizeMode="contain"
      />
      {title ? (
        <Text
          className="text-espuma font-bold mt-4"
          style={{ fontSize: 22, letterSpacing: 0.3 }}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text className="text-pedra-mar text-sm mt-1 text-center">{subtitle}</Text>
      ) : null}
    </View>
  );
}
