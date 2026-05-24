import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather, Ionicons } from '@expo/vector-icons';
import { PedidosStackParamList } from '../../navigation/types';
import OceanHeader from '../../components/shared/OceanHeader';
import { pedidoService } from '../../services/pedidoService';
import { Pedido } from '../../types';

type NavigationProp = StackNavigationProp<PedidosStackParamList, 'Historico'>;

const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  confirmado: { label: 'Confirmado', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  em_preparo: { label: 'Em Preparo', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  a_caminho: { label: 'A Caminho', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  entregue: { label: 'Entregue', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  cancelado: { label: 'Cancelado', color: 'text-rose-700', bgColor: 'bg-rose-100' },
};

const PedidoItemCard = ({ pedido, onPress }: { pedido: Pedido; onPress: () => void }) => {
  const statusInfo = STATUS_MAP[pedido.status] || {
    label: pedido.status,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
  };

  const pescadorNome = pedido.itens[0]?.produto.pescador.nome || 'Pescador Local';
  const dataFormatada = new Date(pedido.criadoEm).toLocaleDateString('pt-BR');
  const valorTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(pedido.valorTotal);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-2xl bg-white border border-slate-100 p-4 mb-3 flex-row items-center"
      activeOpacity={0.7}
    >
      <View className="flex-1">
        {/* Linha Superior */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-bold text-slate-800 text-base">{pescadorNome}</Text>
          <View className={`px-2 py-0.5 rounded-full ${statusInfo.bgColor}`}>
            <Text className={`text-[10px] font-bold uppercase ${statusInfo.color}`}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Linha Central */}
        <Text className="text-slate-500 text-xs mb-3">Ref: #MANG-{pedido.id.slice(-4).toUpperCase()}</Text>

        {/* Linha Inferior */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Feather name="calendar" size={14} color="#94a3b8" />
            <Text className="text-slate-400 text-xs ml-1">{dataFormatada}</Text>
          </View>
          <Text className="font-bold text-slate-900">{valorTotal}</Text>
        </View>
      </View>
      <View className="ml-3">
        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );
};

export default function HistoricoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pedidoService.listarHistorico();
      setPedidos(response.data.pedidos);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await pedidoService.listarHistorico();
      setPedidos(response.data.pedidos);
    } catch (error) {
      console.error('Erro ao atualizar histórico:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-8 mt-12">
      <View className="bg-sky-50 p-6 rounded-full mb-4">
        <Feather name="shopping-bag" size={48} color="#0284c7" />
      </View>
      <Text className="text-xl font-bold text-slate-900 text-center mb-2">
        Nenhum pedido por aqui
      </Text>
      <Text className="text-slate-500 text-center">
        Descubra os peixes e mariscos mais frescos direto de Manguinhos.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-areia">
      <OceanHeader title="Meus Pedidos" />
      
      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0284c7" />
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PedidoItemCard
              pedido={item}
              onPress={() => navigation.navigate('Acompanhamento', { pedidoId: item.id })}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0284c7']} />
          }
        />
      )}
    </View>
  );
}
