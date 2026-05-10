import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  return (
    <View className="flex-1 items-center justify-center bg-white gap-4">
      <Text className="text-lg font-semibold">Login</Text>
      <Pressable
        onPress={() => navigation.navigate('Register')}
        className="px-6 py-3 bg-blue-600 rounded-lg"
      >
        <Text className="text-white font-semibold">Ir para Cadastro</Text>
      </Pressable>
    </View>
  );
}
