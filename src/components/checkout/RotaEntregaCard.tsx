import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Endereco } from '../../types';

interface FreteInfo {
  valorFrete: number;
  prazoEstimadoMinutos: number;
}

interface Props {
  tipoEntrega: 'entrega' | 'retirada';
  enderecoDestino: Endereco | null;
  frete: FreteInfo | null;
  carregandoFrete: boolean;
}

const ORIGEM = {
  nome: 'Maré de Manguinhos',
  bairro: 'Comunidade de Manguinhos',
  cidade: 'Manguinhos · Serra, ES',
};

const ROUTE_LINE_HEIGHT = 64;

const formatCurrency = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

export default function RotaEntregaCard({
  tipoEntrega,
  enderecoDestino,
  frete,
  carregandoFrete,
}: Props) {
  const truckAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    truckAnim.setValue(0);

    if (!carregandoFrete && frete && tipoEntrega === 'entrega') {
      // Loop simples: move de cima para baixo e reinicia (Animated.loop faz reset automático)
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(truckAnim, {
            toValue: 1,
            duration: 2800,
            useNativeDriver: true,
          }),
          Animated.timing(truckAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }

    return undefined;
  }, [carregandoFrete, frete, tipoEntrega, truckAnim]);

  const truckY = truckAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, ROUTE_LINE_HEIGHT - 20],
  });

  if (tipoEntrega === 'retirada') {
    return (
      <View
        className="mx-4 mt-3 bg-white rounded-2xl border border-pedra-mar"
        style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 }}
      >
        <View className="px-4 pt-3 pb-2.5 flex-row items-center border-b border-pedra-mar/40">
          <Ionicons name="storefront-outline" size={15} color="#3A9D8F" />
          <Text className="text-ardosia font-bold text-sm ml-2">Local de Retirada</Text>
        </View>

        <View className="px-4 py-3 flex-row items-start">
          <View className="w-6 items-center mr-3 mt-0.5">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#3FB27E' }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-ardosia font-semibold text-sm">{ORIGEM.nome}</Text>
            <Text className="text-marinha text-xs mt-0.5">{ORIGEM.bairro}</Text>
            <Text className="text-marinha text-xs">{ORIGEM.cidade}</Text>
          </View>
        </View>

        <View className="mx-4 mb-3 py-2 px-3 rounded-xl flex-row items-center" style={{ backgroundColor: 'rgba(63,178,126,0.1)' }}>
          <Ionicons name="checkmark-circle-outline" size={14} color="#3FB27E" />
          <Text className="text-xs font-semibold ml-1.5" style={{ color: '#3FB27E' }}>
            Sem custo de entrega
          </Text>
        </View>
      </View>
    );
  }

  const hasDestino = !!enderecoDestino;

  return (
    <View
      className="mx-4 mt-3 bg-white rounded-2xl border border-pedra-mar"
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 }}
    >
      <View className="px-4 pt-3 pb-2.5 flex-row items-center border-b border-pedra-mar/40">
        <Ionicons name="navigate-outline" size={15} color="#D45D4A" />
        <Text className="text-ardosia font-bold text-sm ml-2">Rota de Entrega</Text>
      </View>

      <View className="px-4 py-3">
        {/* Origem */}
        <View className="flex-row">
          <View className="w-6 items-center mr-3">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3FB27E' }} />
            <View
              className="w-0.5 mt-1"
              style={{ height: 28, backgroundColor: '#D6CFC4' }}
            />
          </View>
          <View className="flex-1 pb-1">
            <Text className="text-ardosia font-semibold text-sm">{ORIGEM.nome}</Text>
            <Text className="text-marinha text-xs mt-0.5">{ORIGEM.bairro}</Text>
            <Text className="text-marinha text-xs">{ORIGEM.cidade}</Text>
          </View>
        </View>

        {/* Linha com caminhão animado + info de frete */}
        <View className="flex-row" style={{ height: ROUTE_LINE_HEIGHT }}>
          <View className="w-6 items-center mr-3" style={{ position: 'relative' }}>
            <View
              style={{
                position: 'absolute',
                width: 2,
                top: 0,
                height: ROUTE_LINE_HEIGHT,
                backgroundColor: '#D6CFC4',
              }}
            />
            {!carregandoFrete && frete ? (
              <Animated.View
                style={{
                  position: 'absolute',
                  left: -1,
                  transform: [{ translateY: truckY }],
                  backgroundColor: 'white',
                  borderRadius: 4,
                  padding: 1,
                  zIndex: 1,
                }}
              >
                <Ionicons name="car-sport" size={18} color="#D45D4A" />
              </Animated.View>
            ) : null}
          </View>

          <View className="flex-1 justify-center">
            {carregandoFrete ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#D45D4A" />
                <Text className="text-marinha text-xs ml-2">Calculando frete...</Text>
              </View>
            ) : frete ? (
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <View
                  className="rounded-full px-2.5 py-1"
                  style={{ backgroundColor: 'rgba(212,93,74,0.1)' }}
                >
                  <Text className="text-terracota font-bold text-xs">
                    {formatCurrency(frete.valorFrete)}
                  </Text>
                </View>
                <View
                  className="rounded-full px-2.5 py-1"
                  style={{ backgroundColor: 'rgba(58,157,143,0.1)' }}
                >
                  <Text className="text-xs font-semibold" style={{ color: '#3A9D8F' }}>
                    ~{frete.prazoEstimadoMinutos} min
                  </Text>
                </View>
              </View>
            ) : hasDestino ? null : (
              <Text className="text-marinha text-xs italic">
                Selecione um endereço para calcular o frete
              </Text>
            )}
          </View>
        </View>

        {/* Destino */}
        <View className="flex-row">
          <View className="w-6 items-center mr-3">
            <View
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: hasDestino ? '#D45D4A' : '#D6CFC4',
              }}
            />
          </View>
          <View className="flex-1 pt-0.5">
            {hasDestino ? (
              <>
                <Text className="text-ardosia font-semibold text-sm">
                  {enderecoDestino!.logradouro}, {enderecoDestino!.numero}
                </Text>
                {enderecoDestino!.complemento ? (
                  <Text className="text-marinha text-xs mt-0.5">
                    {enderecoDestino!.complemento}
                  </Text>
                ) : null}
                <Text className="text-marinha text-xs mt-0.5">
                  {enderecoDestino!.bairro} · {enderecoDestino!.cidade},{' '}
                  {enderecoDestino!.estado}
                </Text>
              </>
            ) : (
              <Text className="text-marinha text-xs italic">
                Endereço de entrega não selecionado
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
