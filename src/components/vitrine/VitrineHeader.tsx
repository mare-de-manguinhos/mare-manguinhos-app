import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import SearchBar from './SearchBar';

interface Props {
  buscaTermo: string;
  onBuscaChange: (text: string) => void;
}

export default function VitrineHeader({ buscaTermo, onBuscaChange }: Props) {
  const nome = useAuthStore((s) => s.usuario?.nome ?? 'Convidado');
  const primeiroNome = nome.split(' ')[0];
  const endereco = useAuthStore((s) => s.enderecoPrincipal);
  const localizacao = endereco
    ? `${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`
    : null;

  return (
    <View
      className="bg-oceano-vivo px-5 pt-14 pb-6 rounded-b-3xl overflow-hidden"
      style={{
        shadowColor: '#0EA5A0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-solar/20" />
      <View className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-espuma/10" />

      <View className="mb-5">
        <Text className="text-espuma text-2xl font-bold mb-1">
          Olá, {primeiroNome}!
        </Text>
        {localizacao && (
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#F2A23A" />
            <Text className="text-espuma/80 text-sm ml-1.5">{localizacao}</Text>
          </View>
        )}
      </View>
      <SearchBar value={buscaTermo} onChangeText={onBuscaChange} />
    </View>
  );
}
