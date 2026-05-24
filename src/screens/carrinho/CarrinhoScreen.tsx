import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCarrinhoStore } from '../../store/carrinhoStore';
import AppButton from '../../components/ui/AppButton';
import OceanHeader from '../../components/shared/OceanHeader';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CarrinhoStackParamList } from '../../navigation/types';

type NavProp = StackNavigationProp<CarrinhoStackParamList, 'CarrinhoLista'>;

export default function CarrinhoScreen() {
  const navigation = useNavigation<NavProp>();
  const { itens, removerItem, total, limpar } = useCarrinhoStore();
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  useFocusEffect(
    React.useCallback(() => {
      // Atualiza sempre que a tela ganha foco
      return;
    }, [])
  );

  const toggleExpandir = (produtoId: string) => {
    const novo = new Set(expandidos);
    if (novo.has(produtoId)) {
      novo.delete(produtoId);
    } else {
      novo.add(produtoId);
    }
    setExpandidos(novo);
  };

  const handleRemover = (produtoId: string, especie: string) => {
    Alert.alert('Remover item', `Remover ${especie} do carrinho?`, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => removerItem(produtoId),
      },
    ]);
  };

  const handleLimparCarrinho = () => {
    Alert.alert('Limpar carrinho', 'Remover todos os itens?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: () => limpar(),
      },
    ]);
  };

  const handleIrParaCheckout = () => {
    navigation.navigate('Checkout');
  };

  return (
    <View className="flex-1 bg-areia">
      <OceanHeader title="Carrinho" />

      {itens.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={64} color="#D45D4A" />
          <Text className="text-ardosia text-xl font-bold mt-4 text-center">
            Seu carrinho está vazio
          </Text>
          <Text className="text-marinha text-sm text-center mt-2">
            Adicione produtos da vitrine para começar suas compras
          </Text>
          <AppButton
            label="Ir para Vitrine"
            onPress={() => {
              // Navigate to Vitrine tab
              navigation.getParent()?.navigate('Vitrine');
            }}
            accessibilityLabel="Ir para vitrine"
          />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Lista de itens */}
          <View className="px-4 pt-4">
            {itens.map((item) => (
              <View
                key={item.produto.id}
                className="mb-4 bg-white rounded-xl overflow-hidden border border-pedra-mar"
              >
                {/* Cabeçalho do item */}
                <Pressable
                  onPress={() => toggleExpandir(item.produto.id)}
                  accessibilityLabel={`Item: ${item.produto.especie}`}
                  accessibilityRole="button"
                  className="flex-row items-center p-4"
                >
                  {item.produto.foto && (
                    <Image
                      source={{ uri: item.produto.foto }}
                      className="w-16 h-16 rounded-lg bg-areia mr-3"
                      resizeMode="cover"
                    />
                  )}

                  <View className="flex-1">
                    <Text className="text-ardosia text-base font-bold">
                      {item.produto.especie}
                    </Text>
                    <Text className="text-marinha text-sm">
                      {item.pesoKg} kg - Corte: {item.corte}
                    </Text>
                    <Text className="text-terracota text-base font-bold mt-1">
                      R$ {(item.produto.precoPorKg * item.pesoKg).toFixed(2)}
                    </Text>
                  </View>

                  <Ionicons
                    name={expandidos.has(item.produto.id) ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#6B655A"
                  />
                </Pressable>

                {/* Detalhes expandidos */}
                {expandidos.has(item.produto.id) && (
                  <>
                    <View className="px-4 py-3 bg-areia border-t border-pedra-mar">
                      <Text className="text-marinha text-sm mb-2">
                        <Text className="font-bold">Pescador:</Text> {item.produto.pescador.nome}
                      </Text>
                      <Text className="text-marinha text-sm mb-2">
                        <Text className="font-bold">Preço por kg:</Text> R${' '}
                        {item.produto.precoPorKg.toFixed(2)}
                      </Text>
                      <Text className="text-marinha text-sm">
                        <Text className="font-bold">Subtotal:</Text> R${' '}
                        {(item.produto.precoPorKg * item.pesoKg).toFixed(2)}
                      </Text>
                    </View>

                    <View className="px-4 py-3 flex-row items-center justify-between border-t border-pedra-mar">
                      <Pressable
                        onPress={() => handleRemover(item.produto.id, item.produto.especie)}
                        className="flex-row items-center"
                        accessibilityLabel={`Remover ${item.produto.especie}`}
                        accessibilityRole="button"
                      >
                        <Ionicons name="trash-outline" size={18} color="#D64550" />
                        <Text className="text-coral text-sm font-semibold ml-2">Remover</Text>
                      </Pressable>

                      <Text className="text-ardosia text-sm font-bold">
                        Quantidade: {item.pesoKg} kg
                      </Text>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>

          {/* Resumo */}
          <View className="mx-4 mt-6 p-4 bg-white rounded-xl border border-pedra-mar">
            <Text className="text-ardosia text-lg font-bold mb-4">Resumo</Text>

            <View className="mb-3 flex-row justify-between">
              <Text className="text-marinha text-base">Subtotal ({itens.length} item{itens.length !== 1 ? 's' : ''})</Text>
              <Text className="text-ardosia text-base font-bold">
                R$ {total().toFixed(2)}
              </Text>
            </View>

            <View className="mb-4 py-3 border-t border-b border-pedra-mar">
              <View className="flex-row justify-between">
                <Text className="text-marinha text-base">Frete</Text>
                <Text className="text-marinha text-sm italic">Calculado no checkout</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-6">
              <Text className="text-ardosia text-lg font-bold">Total</Text>
              <Text className="text-terracota text-xl font-bold">
                R$ {total().toFixed(2)}
              </Text>
            </View>

            <AppButton
              label="Ir para Checkout"
              onPress={handleIrParaCheckout}
              accessibilityLabel="Ir para checkout"
            />

            <Pressable
              onPress={handleLimparCarrinho}
              className="mt-3 py-3 flex-row items-center justify-center"
              accessibilityLabel="Limpar carrinho"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={16} color="#D64550" />
              <Text className="text-coral text-base font-semibold ml-2">Limpar carrinho</Text>
            </Pressable>
          </View>

          {/* Botão de voltar para vitrine */}
          <View className="mx-4 mt-4">
            <AppButton
              label="Continuar Comprando"
              onPress={() => {
                navigation.getParent()?.navigate('Vitrine');
              }}
              variant="secondary"
              accessibilityLabel="Continuar comprando"
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}
