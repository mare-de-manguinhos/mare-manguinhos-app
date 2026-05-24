import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PASSO = 0.5;
const MINIMO = 0.5;

interface Props {
  peso: number;
  pesoDisponivel: number;
  onChange: (novoPeso: number) => void;
}

export default function PesoControl({ peso, pesoDisponivel, onChange }: Props) {
  const noMinimo = peso <= MINIMO;
  const noMaximo = peso >= pesoDisponivel;

  const diminuir = () => {
    if (!noMinimo) onChange(Math.round((peso - PASSO) * 10) / 10);
  };

  const aumentar = () => {
    if (!noMaximo) onChange(Math.round((peso + PASSO) * 10) / 10);
  };

  return (
    <View className="flex-row items-center gap-4">
      <Pressable
        onPress={diminuir}
        disabled={noMinimo}
        accessibilityLabel="Diminuir peso"
        accessibilityRole="button"
        accessibilityState={{ disabled: noMinimo }}
        className={`h-12 w-12 items-center justify-center rounded-full ${
          noMinimo ? 'bg-pedra-mar/40' : 'bg-terracota'
        }`}
        style={({ pressed }) => ({ opacity: pressed && !noMinimo ? 0.8 : 1 })}
      >
        <Ionicons name="remove" size={24} color={noMinimo ? '#D6CFC4' : '#FFFCF7'} />
      </Pressable>

      <View className="min-w-[80px] items-center">
        <Text className="text-ardosia text-2xl font-bold">
          {peso.toFixed(1)}
        </Text>
        <Text className="text-marinha text-sm">kg</Text>
      </View>

      <Pressable
        onPress={aumentar}
        disabled={noMaximo}
        accessibilityLabel="Aumentar peso"
        accessibilityRole="button"
        accessibilityState={{ disabled: noMaximo }}
        className={`h-12 w-12 items-center justify-center rounded-full ${
          noMaximo ? 'bg-pedra-mar/40' : 'bg-terracota'
        }`}
        style={({ pressed }) => ({ opacity: pressed && !noMaximo ? 0.8 : 1 })}
      >
        <Ionicons name="add" size={24} color={noMaximo ? '#D6CFC4' : '#FFFCF7'} />
      </Pressable>
    </View>
  );
}
