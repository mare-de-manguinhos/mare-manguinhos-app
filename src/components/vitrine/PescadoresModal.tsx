import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pescador } from '../../types';

interface Props {
  visible: boolean;
  pescadores: Pescador[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function PescadoresModal({ visible, pescadores, selectedId, onSelect, onClose }: Props) {
  const [busca, setBusca] = useState('');

  const filtrados = busca.length >= 2
    ? pescadores.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : pescadores;

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-espuma rounded-t-3xl max-h-[80%] min-h-[50%]">
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-pedra-mar/30">
            <Text className="text-ardosia text-xl font-bold">Todos os Pescadores</Text>
            <Pressable
              onPress={onClose}
              accessibilityLabel="Fechar"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-outline" size={24} color="#2C241E" />
            </Pressable>
          </View>

          <View className="px-5 py-3">
            <View className="flex-row items-center rounded-xl bg-areia px-4 py-3">
              <Ionicons name="search-outline" size={20} color="#6B655A" style={{ marginRight: 8 }} />
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar pescador..."
                placeholderTextColor="#6B655A"
                className="flex-1 text-ardosia text-base"
                accessibilityLabel="Buscar pescador por nome"
                returnKeyType="search"
              />
              {busca.length > 0 && (
                <Pressable onPress={() => setBusca('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-outline" size={20} color="#6B655A" />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView className="px-5 pb-6">
            {filtrados.length === 0 ? (
              <View className="items-center py-12">
                <Ionicons name="search-outline" size={40} color="#6B655A" />
                <Text className="text-marinha text-sm text-center mt-3">
                  Nenhum pescador encontrado para &ldquo;{busca}&rdquo;
                </Text>
              </View>
            ) : (
              filtrados.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => handleSelect(p.id)}
                  className={`flex-row items-center py-4 px-3 rounded-xl mb-1 ${selectedId === p.id ? 'bg-terracota/10' : ''}`}
                  accessibilityLabel={`Selecionar ${p.nome}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedId === p.id }}
                >
                  <View className="h-12 w-12 rounded-full overflow-hidden bg-pedra-mar/30 items-center justify-center">
                    <Image
                      source={{ uri: p.foto }}
                      className="h-full w-full rounded-full"
                      resizeMode="cover"
                      accessibilityLabel={p.nome}
                    />
                  </View>
                  <Text className="flex-1 text-ardosia text-base font-medium ml-3">{p.nome}</Text>
                  {selectedId === p.id && (
                    <Ionicons name="checkmark-circle" size={22} color="#D45D4A" />
                  )}
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
