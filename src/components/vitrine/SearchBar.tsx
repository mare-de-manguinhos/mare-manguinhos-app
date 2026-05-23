import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar peixes, crustáceos...',
}: Props) {
  const [localText, setLocalText] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalText(value);
  }, [value]);

  const handleChange = (text: string) => {
    setLocalText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChangeText(text);
    }, 300);
  };

  const handleClear = () => {
    setLocalText('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onChangeText('');
  };

  return (
    <View className="flex-row items-center rounded-xl bg-espuma px-4 py-3">
      <Ionicons name="search-outline" size={20} color="#6B655A" style={{ marginRight: 8 }} />
      <TextInput
        value={localText}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#6B655A"
        className="flex-1 text-ardosia text-base"
        accessibilityLabel="Buscar produtos"
        returnKeyType="search"
      />
      {localText.length > 0 && (
        <Pressable
          onPress={handleClear}
          accessibilityLabel="Limpar busca"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-outline" size={20} color="#6B655A" />
        </Pressable>
      )}
    </View>
  );
}
