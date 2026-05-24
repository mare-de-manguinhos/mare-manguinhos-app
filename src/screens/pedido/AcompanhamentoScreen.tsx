import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PedidosStackParamList } from '../../navigation/types';
import StepIndicator from '../../components/ui/StepIndicator';
import AppButton from '../../components/ui/AppButton';
import { usePedidoStore } from '../../store/pedidoStore';

type AcompanhamentoRouteProp = RouteProp<PedidosStackParamList, 'Acompanhamento'>;

const STEPS = ['Confirmado', 'Em Preparo', 'A Caminho', 'Entregue'];

const STATUS_TO_STEP: Record<string, number> = {
  confirmado: 1,
  em_preparo: 2,
  a_caminho: 3,
  entregue: 4,
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

export default function AcompanhamentoScreen() {
  const route = useRoute<AcompanhamentoRouteProp>();
  const { pedidoId } = route.params;

  const { pedidoAtivo: pedido, loading, buscarStatus } = usePedidoStore();

  const carregarDados = useCallback(async () => {
    try {
      await buscarStatus(pedidoId);
    } catch (error) {
      console.error('Erro ao buscar status do pedido:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do pedido.');
    }
  }, [pedidoId, buscarStatus]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleContatoWhatsApp = () => {
    if (!pedido) return;
    const pescador = pedido.itens[0]?.produto.pescador;
    const nomePescador = pescador?.nome || 'Pescador';
    const telefone = pescador?.telefone || '5527999999999';
    const msg = `Olá ${nomePescador}, estou entrando em contato sobre o meu pedido #MANG-${pedido.id.slice(-4).toUpperCase()}.`;
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'WhatsApp não instalado ou link inválido.');
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-areia">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D45D4A" />
        </View>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View className="flex-1 bg-areia">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-marinha text-center">Não foi possível encontrar as informações deste pedido.</Text>
        </View>
      </View>
    );
  }

  const isCancelado = pedido.status === 'cancelado';
  const currentStep = STATUS_TO_STEP[pedido.status] || 1;

  return (
    <View className="flex-1 bg-areia">

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Painel de Progresso */}
        <View className="bg-white rounded-3xl p-4 shadow-sm mb-6 border border-pedra-mar/30">
          <Text className="text-ardosia font-bold text-lg mb-4 ml-2">Status da Maré</Text>
          
          {isCancelado ? (
            <View className="bg-rose-50 p-4 rounded-2xl flex-row items-center border border-rose-100">
              <Feather name="alert-circle" size={24} color="#e11d48" />
              <View className="ml-3 flex-1">
                <Text className="text-rose-800 font-bold">Pedido Cancelado</Text>
                <Text className="text-rose-600 text-xs">O pedido foi cancelado e não poderá ser entregue.</Text>
              </View>
            </View>
          ) : (
            <StepIndicator currentStep={currentStep} totalSteps={4} labels={STEPS} />
          )}
        </View>

        {/* Bloco do Pescador */}
        <View className="bg-white rounded-3xl p-5 shadow-sm mb-6 border border-pedra-mar/30">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-terracota/10 p-3 rounded-2xl mr-3">
                <Ionicons name="boat" size={24} color="#D45D4A" />
              </View>
              <View>
                <Text className="text-marinha text-xs uppercase font-bold tracking-wider">Pescador Responsável</Text>
                <Text className="text-ardosia font-bold text-lg">
                  {pedido.itens[0]?.produto.pescador.nome || 'Assoc. Pescadores'}
                </Text>
                <Text className="text-marinha text-xs">Porto de Manguinhos, ES</Text>
              </View>
            </View>
          </View>
          
          <AppButton 
            label="Contato via WhatsApp" 
            onPress={handleContatoWhatsApp} 
            variant="outline"
            disabled={isCancelado}
            accessibilityLabel="Entrar em contato com o pescador pelo WhatsApp"
          />
        </View>

        {/* Resumo de Produtos */}
        <View className="bg-white rounded-3xl p-5 shadow-sm mb-6 border border-pedra-mar/30">
          <Text className="text-ardosia font-bold text-lg mb-4">Produtos da Maré</Text>
          {pedido.itens.map((item, index) => (
            <View key={index} className="flex-row items-center mb-4 last:mb-0">
              <View className="bg-terracota/10 p-2 rounded-xl mr-3">
                <MaterialCommunityIcons name="fish" size={20} color="#D45D4A" />
              </View>
              <View className="flex-1">
                <Text className="text-ardosia font-medium">{item.produto.especie}</Text>
                <Text className="text-marinha text-xs">Corte: {item.corte} • {item.pesoKg}kg</Text>
              </View>
              <Text className="text-ardosia font-bold">
                {formatCurrency(item.produto.precoPorKg * item.pesoKg)}
              </Text>
            </View>
          ))}
        </View>

        {/* Resumo Financeiro */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-pedra-mar/30">
          <View className="flex-row justify-between mb-2">
            <Text className="text-marinha">Subtotal dos pescados</Text>
            <Text className="text-ardosia">{formatCurrency(pedido.valorTotal - pedido.frete)}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-marinha">Taxa de entrega (comunidade)</Text>
            <Text className="text-ardosia">{formatCurrency(pedido.frete)}</Text>
          </View>
          <View className="h-[1px] bg-pedra-mar/50 mb-4" />
          <View className="flex-row justify-between items-center">
            <Text className="text-ardosia font-bold text-lg">Total Pago</Text>
            <Text className="text-terracota font-bold text-2xl">{formatCurrency(pedido.valorTotal)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
