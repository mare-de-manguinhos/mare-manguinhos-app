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
  const variantClasses =
    variant === 'primary'
      ? 'bg-mar'
      : 'bg-espuma border border-pedra-mar';
  const disabledClasses = isDisabled ? 'opacity-50' : 'opacity-100';

  const textClasses =
    variant === 'primary' ? 'text-espuma font-semibold text-base' : 'text-mar font-semibold text-base';

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
          color={variant === 'primary' ? '#FAFCFD' : '#1A5F7A'}
          accessibilityLabel="Carregando"
        />
      ) : (
        <Text className={textClasses}>{label}</Text>
      )}
    </Pressable>
  );
}
