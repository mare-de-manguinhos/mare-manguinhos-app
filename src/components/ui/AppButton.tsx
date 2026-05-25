import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { AppButtonProps } from '../../types';

export default function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  accessibilityLabel,
}: Readonly<AppButtonProps>) {
  const isDisabled = disabled || loading;

  const baseClasses = 'rounded-xl py-4 items-center justify-center flex-row';
  
  let variantClasses = 'bg-terracota';
  let textClasses = 'text-espuma font-semibold text-base';
  let loaderColor = '#FFFCF7';

  if (variant === 'secondary') {
    variantClasses = 'bg-espuma border border-pedra-mar';
    textClasses = 'text-terracota font-semibold text-base';
    loaderColor = '#D45D4A';
  } else if (variant === 'outline') {
    variantClasses = 'bg-transparent border border-terracota';
    textClasses = 'text-terracota font-semibold text-base';
    loaderColor = '#D45D4A';
  }

  const disabledClasses = isDisabled ? 'opacity-50' : 'opacity-100';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => ({ opacity: pressed && !isDisabled ? 0.8 : 1 })}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
    >
      {loading ? (
        <ActivityIndicator
          color={loaderColor}
          accessibilityLabel="Carregando"
        />
      ) : (
        <Text className={textClasses}>{label}</Text>
      )}
    </Pressable>
  );
}
