import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PedidosStackParamList } from '../../navigation/types';
import OceanHeader from '../../components/shared/OceanHeader';
import StepIndicator from '../../components/ui/StepIndicator';
import AppButton from '../../components/ui/AppButton';
import { pedidoService } from '../../services/pedidoService';
import { Pedido } from '../../types';

type AcompanhamentoRouteProp = RouteProp<PedidosStackParamList, 'Acompanhamento'>;

const STEPS = ['Recebido', 'Confirmado', 'A Caminho', 'Entregue'];

const STATUS_TO_STEP: Record<string, number> = {
  confirmado: 2,
  em_preparo: 2,
  a_caminho: 3,
  entregue: 4,
};

export default function AcompanhamentoScreen() {
  const route = useRoute<AcompanhamentoRouteProp>();
  const navigation = useNavigation();
  const { pedidoId } = route.params;

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pedidoService.buscarStatus(pedidoId);
      setPedido(response.data);
    } catch (error) {
      console.error('Erro ao buscar status do pedido:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do pedido.');
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleContatoWhatsApp = () => {
    if (!pedido) return;
    const pescador = pedido.itens[0]?.produto.pescador;
    const nomePescador = pescador?.nome || 'Pescador';
    const msg = `Olá ${nomePescador}, estou entrando em contato sobre o meu pedido #MANG-${pedido.id.slice(-4).toUpperCase()}.`;
    const url = `https://wa.me/5527999999999?text=${encodeURIComponent(msg)}`;
    
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
        <OceanHeader title={`Pedido #${pedidoId.slice(-4).toUpperCase()}`} showBackButton onBackPress={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0284c7" />
        </View>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View className="flex-1 bg-areia">
        <OceanHeader title="Pedido não encontrado" showBackButton onBackPress={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-slate-500 text-center">Não foi possível encontrar as informações deste pedido.</Text>
        </View>
      </View>
    );
  }

  const isCancelado = pedido.status === 'cancelado';
  const currentStep = STATUS_TO_STEP[pedido.status] || 1;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <View className="flex-1 bg-areia">
      <OceanHeader 
        title={`Pedido #${pedido.id.slice(-4).toUpperCase()}`} 
        showBackButton 
        onBackPress={() => navigation.goBack()} 
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Painel de Progresso */}
        <View className="bg-white rounded-3xl p-4 shadow-sm mb-6 border border-slate-50">
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
        <View className="bg-white rounded-3xl p-5 shadow-sm mb-6 border border-slate-50">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-sky-100 p-3 rounded-2xl mr-3">
                <Ionicons name="boat" size={24} color="#0284c7" />
              </View>
              <View>
                <Text className="text-slate-400 text-xs uppercase font-bold tracking-wider">Pescador Responsável</Text>
                <Text className="text-ardosia font-bold text-lg">
                  {pedido.itens[0]?.produto.pescador.nome || 'Assoc. Pescadores'}
                </Text>
                <Text className="text-slate-500 text-xs">Porto de Manguinhos, ES</Text>
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
        <View className="bg-white rounded-3xl p-5 shadow-sm mb-6 border border-slate-50">
          <Text className="text-ardosia font-bold text-lg mb-4">Produtos da Maré</Text>
          {pedido.itens.map((item, index) => (
            <View key={index} className="flex-row items-center mb-4 last:mb-0">
              <View className="bg-sky-50 p-2 rounded-xl mr-3">
                <MaterialCommunityIcons name="fish" size={20} color="#0284c7" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-medium">{item.produto.especie}</Text>
                <Text className="text-slate-400 text-xs">Corte: {item.corte} • {item.pesoKg}kg</Text>
              </View>
              <Text className="text-slate-700 font-bold">
                {formatCurrency(item.produto.precoPorKg * item.pesoKg)}
              </Text>
            </View>
          ))}
        </View>

        {/* Resumo Financeiro */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-500">Subtotal dos pescados</Text>
            <Text className="text-slate-700">{formatCurrency(pedido.valorTotal - pedido.frete)}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-500">Taxa de entrega (comunidade)</Text>
            <Text className="text-slate-700">{formatCurrency(pedido.frete)}</Text>
          </View>
          <View className="h-[1px] bg-slate-100 mb-4" />
          <View className="flex-row justify-between items-center">
            <Text className="text-ardosia font-bold text-lg">Total Pago</Text>
            <Text className="text-sky-700 font-bold text-2xl">{formatCurrency(pedido.valorTotal)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
