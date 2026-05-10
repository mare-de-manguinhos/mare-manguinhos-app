import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
} from 'react-native';
import { AppInputProps } from '../../types';

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  onToggleSecure,
  keyboardType,
  autoCapitalize = 'none',
  accessibilityLabel,
  accessibilityHint,
  onBlur,
  editable = true,
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  let borderColor = '#B8D4DC'; // pedra-mar
  if (focused) borderColor = '#1A5F7A'; // mar
  if (error) borderColor = '#E05A5A'; // coral

  return (
    <View className="mb-4">
      <Text className="text-ardosia text-sm font-medium mb-1">{label}</Text>
      <View
        className="flex-row items-center rounded-xl bg-espuma px-3 py-3"
        style={{ borderWidth: 1.5, borderColor }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#5A7A87"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessible
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          className="flex-1 text-ardosia text-base"
        />
        {onToggleSecure && (
          <Pressable
            onPress={onToggleSecure}
            accessibilityLabel={
              secureTextEntry ? 'Mostrar senha' : 'Ocultar senha'
            }
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            className="ml-2 p-1"
          >
            <Text className="text-marinha text-sm">
              {secureTextEntry ? 'Ver' : 'Ocultar'}
            </Text>
          </Pressable>
        )}
      </View>
      {error ? (
        <Text
          className="text-coral text-xs mt-1"
          accessibilityLabel={`Erro: ${error}`}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
