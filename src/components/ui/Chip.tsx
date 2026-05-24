import React from 'react';
import { Text, Pressable } from 'react-native';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}

export default function Chip({ label, active, onPress, accessibilityLabel }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={`rounded-full px-5 py-3 ${active ? 'bg-terracota' : 'bg-espuma border border-pedra-mar'}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Text className={`text-base font-semibold ${active ? 'text-espuma' : 'text-marinha'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
