import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center justify-center bg-white gap-4">
      <Text className="text-lg font-semibold">Cadastro</Text>
      <Pressable
        onPress={() => navigation.goBack()}
        className="px-6 py-3 bg-gray-200 rounded-lg"
      >
        <Text className="text-gray-800 font-semibold">Voltar ao Login</Text>
      </Pressable>
    </View>
  );
}
