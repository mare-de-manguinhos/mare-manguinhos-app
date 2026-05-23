import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { VitrineData } from '../../types';
import { vitrineService } from '../../services/vitrineService';
import type { VitrineStackParamList } from '../../navigation/types';
import VitrineBanner from '../../components/vitrine/VitrineBanner';
import PescadorCard from '../../components/vitrine/PescadorCard';
import CategoriaChip from '../../components/vitrine/CategoriaChip';
import ProdutoCard from '../../components/vitrine/ProdutoCard';
import VitrineHeader from '../../components/vitrine/VitrineHeader';
import PescadoresModal from '../../components/vitrine/PescadoresModal';

type Estado = 'carregando' | 'erro' | 'pronto';

type NavProp = import('@react-navigation/stack').StackNavigationProp<VitrineStackParamList, 'Vitrine'>;

export default function VitrineScreen() {
  const navigation = useNavigation<NavProp>();
  const [estado, setEstado] = useState<Estado>('carregando');
  const [dados, setDados] = useState<VitrineData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [pescadorId, setPescadorId] = useState<string | null>(null);
  const [categoriaId, setCategoriaId] = useState('todos');
  const [buscaTermo, setBuscaTermo] = useState('');
  const [pescadoresModalVisible, setPescadoresModalVisible] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const data = await vitrineService.listarVitrine();
      setDados(data);
      setEstado('pronto');
    } catch {
      setEstado('erro');
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  }, [carregar]);

  const togglePescador = useCallback((id: string) => {
    setPescadorId((prev) => (prev === id ? null : id));
  }, []);

  const topPescadores = useMemo(() => {
    if (!dados) return [];
    const contagem = new Map<string, number>();
    dados.produtos.forEach((p) => {
      contagem.set(p.pescador.id, (contagem.get(p.pescador.id) || 0) + 1);
    });
    return [...dados.pescadores]
      .sort((a, b) => (contagem.get(b.id) || 0) - (contagem.get(a.id) || 0))
      .slice(0, 10);
  }, [dados]);

  const produtosFiltrados = useMemo(() => {
    if (!dados) return [];
    return dados.produtos.filter((p) => {
      if (pescadorId && p.pescador.id !== pescadorId) return false;

      if (categoriaId !== 'todos' && p.categoria !== categoriaId) return false;

      if (buscaTermo.length >= 2) {
        const termo = buscaTermo.toLowerCase();
        if (!p.especie.toLowerCase().includes(termo)) return false;
      }

      return true;
    });
  }, [dados, pescadorId, categoriaId, buscaTermo]);

  if (estado === 'carregando' && !dados) {
    return (
      <View className="flex-1 items-center justify-center bg-areia">
        <ActivityIndicator size="large" color="#1A5F7A" accessibilityLabel="Carregando vitrine" />
      </View>
    );
  }

  if (estado === 'erro' && !dados) {
    return (
      <View className="flex-1 items-center justify-center bg-areia px-6">
        <Text className="text-ardosia text-lg font-bold text-center mb-2">
          Não foi possível carregar a vitrine
        </Text>
        <Text className="text-marinha text-sm text-center mb-6">
          Verifique sua conexão e tente novamente
        </Text>
        <Pressable
          onPress={carregar}
          className="rounded-xl bg-mar px-10 py-4"
          accessibilityLabel="Tentar novamente"
          accessibilityRole="button"
        >
          <Text className="text-espuma font-semibold text-base">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!dados) return null;

  return (
    <View className="flex-1 bg-areia">
      <VitrineHeader buscaTermo={buscaTermo} onBuscaChange={setBuscaTermo} />
      <ScrollView
        className="bg-areia"
        contentContainerClassName="pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1A5F7A"
            accessibilityLabel="Recarregar vitrine"
          />
        }
      >
        {dados.banner && <VitrineBanner banner={dados.banner} />}

        <View className="mb-4">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-ardosia text-xl font-bold">Nossos Pescadores</Text>
            {pescadorId && (
              <Pressable
                onPress={() => setPescadorId(null)}
                className="flex-row items-center rounded-full bg-mar/10 px-3 py-1.5"
                accessibilityLabel="Limpar filtro de pescador"
                accessibilityRole="button"
              >
                <Text className="text-mar text-sm font-semibold mr-1">
                  {dados.pescadores.find((p) => p.id === pescadorId)?.nome}
                </Text>
                <Ionicons name="close-outline" size={16} color="#1A5F7A" />
              </Pressable>
            )}
          </View>
          {dados.pescadores.length === 0 ? (
            <Text className="text-marinha text-base px-4">
              Nenhum pescador disponível no momento
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 items-center"
            >
              {dados.pescadores.length > 10 && (
                <Pressable
                  onPress={() => setPescadoresModalVisible(true)}
                  className="h-20 w-20 rounded-full bg-mar items-center justify-center mr-4"
                  accessibilityLabel="Ver todos os pescadores"
                  accessibilityRole="button"
                >
                  <Ionicons name="list-outline" size={24} color="#FAFCFD" />
                  <Text className="text-espuma text-[10px] font-bold mt-0.5">Ver +</Text>
                </Pressable>
              )}
              {topPescadores.map((p) => (
                <PescadorCard
                  key={p.id}
                  pescador={p}
                  selected={pescadorId === p.id}
                  onPress={() => togglePescador(p.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4"
          >
            {dados.categorias.map((c) => (
              <CategoriaChip
                key={c.id}
                categoria={c}
                active={categoriaId === c.id}
                onPress={() => setCategoriaId(c.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View className="px-4 mb-8">
          <Text className="text-ardosia text-xl font-bold mb-3">Disponível agora</Text>
          {produtosFiltrados.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons name="fish-outline" size={40} color="#5A7A87" style={{ marginBottom: 12 }} />
              {buscaTermo.length >= 2 ? (
              <Text className="text-marinha text-base text-center">
                Nenhum resultado para &ldquo;{buscaTermo}&rdquo;
              </Text>
            ) : (
              <Text className="text-marinha text-base text-center">
                Nenhum produto disponível no momento. Volte mais tarde!
                </Text>
              )}
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {produtosFiltrados.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  onPress={() => navigation.navigate('Produto', { produtoId: produto.id })}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <PescadoresModal
        visible={pescadoresModalVisible}
        pescadores={dados.pescadores}
        selectedId={pescadorId}
        onSelect={togglePescador}
        onClose={() => setPescadoresModalVisible(false)}
      />
    </View>
  );
}
