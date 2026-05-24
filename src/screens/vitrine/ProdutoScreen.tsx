import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VitrineStackParamList } from '../../navigation/types';
import { vitrineService } from '../../services/vitrineService';
import { Produto, Corte } from '../../types';
import { useCarrinhoStore } from '../../store/carrinhoStore';
import CorteChip from '../../components/vitrine/CorteChip';
import PesoControl from '../../components/vitrine/PesoControl';

type ProdutoRoute = RouteProp<VitrineStackParamList, 'Produto'>;
type NavProp = StackNavigationProp<VitrineStackParamList, 'Produto'>;

export default function ProdutoScreen() {
  const route = useRoute<ProdutoRoute>();
  const navigation = useNavigation<NavProp>();
  const { produtoId } = route.params;
  const adicionarItem = useCarrinhoStore((s) => s.adicionarItem);

  const [produto, setProduto] = useState<Produto | null>(null);
  const [status, setStatus] = useState<'carregando' | 'pronto' | 'erro'>('carregando');
  const [corteSelecionado, setCorteSelecionado] = useState<Corte>('inteiro');
  const [pesoSelecionado, setPesoSelecionado] = useState(0.5);
  const [imageError, setImageError] = useState(false);
  const [adicionando, setAdicionando] = useState(false);
  const [mostrouToast, setMostrouToast] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const carregar = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('carregando');
    try {
      const data = await vitrineService.buscarProduto(produtoId);
      if (controller.signal.aborted) return;
      setProduto(data);
      setCorteSelecionado(data.cortesDisponiveis[0] || 'inteiro');
      setPesoSelecionado(0.5);
      setStatus('pronto');
    } catch {
      if (!controller.signal.aborted) {
        setStatus('erro');
      }
    }
  }, [produtoId]);

  useEffect(() => {
    carregar();
    return () => abortRef.current?.abort();
  }, [carregar]);

  const handleAdicionar = () => {
    if (!produto) return;
    setAdicionando(true);
    adicionarItem(produto, corteSelecionado, pesoSelecionado);
    setMostrouToast(true);
    setTimeout(() => {
      setAdicionando(false);
      setMostrouToast(false);
    }, 2000);
  };

  const valorTotal = produto ? produto.precoPorKg * pesoSelecionado : 0;
  const esgotado = produto ? produto.pesoDisponivel <= 0 : false;

  if (status === 'carregando') {
    return (
      <View className="flex-1 items-center justify-center bg-areia">
        <ActivityIndicator size="large" color="#D45D4A" />
        <Text className="text-marinha text-base mt-4">Carregando produto...</Text>
      </View>
    );
  }

  if (status === 'erro' || !produto) {
    return (
      <View className="flex-1 items-center justify-center bg-areia px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#D64550" />
        <Text className="text-ardosia text-lg font-bold mt-4 text-center">
          Não foi possível carregar os detalhes do produto
        </Text>
        <Pressable
          onPress={carregar}
          accessibilityLabel="Tentar novamente"
          accessibilityRole="button"
          className="mt-6 rounded-xl bg-terracota px-8 py-4"
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Text className="text-espuma text-base font-bold">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-areia">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Detalhes do produto"
      >
        <View className="relative h-72 w-full">
          {imageError ? (
            <View className="h-full w-full items-center justify-center bg-pedra-mar/20">
              <Ionicons name="fish-outline" size={72} color="#6B655A" />
            </View>
          ) : (
            <Image
              source={{ uri: produto.foto }}
              className="h-full w-full"
              resizeMode="cover"
              onError={() => setImageError(true)}
              accessibilityLabel={produto.especie}
            />
          )}
          <View
            className="absolute bottom-0 left-0 right-0 h-6"
            style={{ backgroundColor: '#FBF6EF', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
          />
        </View>

        <View className="px-5">
          <Text className="text-ardosia text-2xl font-bold">{produto.especie}</Text>

          <View className="flex-row items-center mt-3">
            <Image
              source={{ uri: produto.pescador.foto }}
              className="h-10 w-10 rounded-full"
              accessibilityLabel={`Foto de ${produto.pescador.nome}`}
            />
            <View className="ml-3">
              <Text className="text-marinha text-sm">Pescador</Text>
              <Text className="text-ardosia text-base font-semibold">
                {produto.pescador.nome}
              </Text>
            </View>
            {!esgotado && (
              <View className="ml-auto rounded-full bg-terracota/10 px-3 py-1">
                <Text className="text-terracota text-xs font-bold">Disponível</Text>
              </View>
            )}
          </View>

          <Text className="text-marinha text-base leading-6 mt-4">
            {produto.descricao}
          </Text>

          <View className="mt-6 flex-row items-baseline">
            <Text className="text-terracota text-3xl font-bold">
              R$ {produto.precoPorKg.toFixed(2)}
            </Text>
            <Text className="text-marinha text-base ml-1">/kg</Text>
          </View>

          <Text className="text-marinha text-sm mt-1">
            {produto.pesoDisponivel.toFixed(1)} kg disponíveis
          </Text>

          {produto.cortesDisponiveis.length > 0 && (
            <View className="mt-6">
              <Text className="text-ardosia text-base font-semibold mb-3">Corte</Text>
              <CorteChip
                cortes={produto.cortesDisponiveis}
                selecionado={corteSelecionado}
                onSelect={setCorteSelecionado}
              />
            </View>
          )}

          <View className="mt-6">
            <Text className="text-ardosia text-base font-semibold mb-3">
              Peso desejado
            </Text>
            <PesoControl
              peso={pesoSelecionado}
              pesoDisponivel={produto.pesoDisponivel}
              onChange={setPesoSelecionado}
            />
          </View>

          <View className="mt-6 mb-4 flex-row items-center justify-between rounded-2xl bg-espuma px-5 py-4 border border-pedra-mar/30">
            <Text className="text-ardosia text-base font-semibold">Valor total</Text>
            <Text className="text-terracota text-2xl font-bold">
              R$ {valorTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {mostrouToast && (
        <View className="absolute top-4 left-5 right-5 z-50 rounded-xl bg-mangue px-5 py-4 flex-row items-center shadow-lg">
          <Ionicons name="checkmark-circle" size={22} color="#FFFCF7" />
          <Text className="text-espuma text-base font-semibold ml-2">
            Adicionado ao carrinho!
          </Text>
        </View>
      )}

      <View className="px-5 pb-6 pt-3" style={{ backgroundColor: '#FBF6EF' }}>
        <Pressable
          onPress={handleAdicionar}
          disabled={esgotado || adicionando}
          accessibilityLabel={
            esgotado
              ? 'Produto indisponível'
              : `Adicionar ao carrinho, R$ ${valorTotal.toFixed(2)}`
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: esgotado }}
          className={`h-14 items-center justify-center rounded-2xl ${
            esgotado ? 'bg-pedra-mar/60' : 'bg-terracota'
          }`}
          style={({ pressed }) => ({ opacity: pressed && !esgotado ? 0.9 : 1 })}
        >
          <Text className="text-espuma text-base font-bold">
            {esgotado
              ? 'Indisponível'
              : `Adicionar — R$ ${valorTotal.toFixed(2)}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
