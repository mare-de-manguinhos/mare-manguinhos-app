import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CarrinhoStackParamList } from '../../navigation/types';
import { useCarrinhoStore } from '../../store/carrinhoStore';
import { perfilService } from '../../services/perfilService';
import { freteService } from '../../services/freteService';
import { pedidoService } from '../../services/pedidoService';
import { Endereco, FormaPagamento } from '../../types';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import Chip from '../../components/ui/Chip';

type NavProp = StackNavigationProp<CarrinhoStackParamList, 'Checkout'>;

type TipoEntrega = 'entrega' | 'retirada';
type Estado = 'editando' | 'enviando';

interface FreteInfo {
  valorFrete: number;
  prazoEstimadoMinutos: number;
}

const corteLabel: Record<string, string> = {
  inteiro: 'Inteiro',
  limpo: 'Limpo',
  file: 'Filé',
};

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function CheckoutScreen() {
  const navigation = useNavigation<NavProp>();
  const { itens, total, limpar } = useCarrinhoStore();

  // Estados principais
  const [estado, setEstado] = useState<Estado>('editando');
  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('entrega');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Endereços
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<string | null>(null);
  const [carregandoEnderecos, setCarregandoEnderecos] = useState(false);
  const [mostrarFormularioEndereco, setMostrarFormularioEndereco] = useState(false);

  // Novo endereço
  const [novoEndereco, setNovoEndereco] = useState({
    label: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
  });
  const [errosEndereco, setErrosEndereco] = useState<Record<string, string>>({});
  const [salvandoEndereco, setSalvandoEndereco] = useState(false);

  // Animação do modal de endereço
  const animEndereco = useRef(new Animated.Value(0)).current;
  const [animandoEndereco, setAnimandoEndereco] = useState(false);

  useEffect(() => {
    if (mostrarFormularioEndereco) {
      animEndereco.setValue(0);
      setAnimandoEndereco(true);
      Animated.timing(animEndereco, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setAnimandoEndereco(false));
    }
  }, [mostrarFormularioEndereco, animEndereco]);

  const handleFecharEndereco = (callback?: () => void) => {
    if (animandoEndereco) return;
    setAnimandoEndereco(true);
    Animated.timing(animEndereco, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setAnimandoEndereco(false);
      setMostrarFormularioEndereco(false);
      if (callback) callback();
    });
  };

  const enderecoOverlay = animEndereco.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const enderecoSheetY = animEndereco.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  // Frete
  const [frete, setFrete] = useState<FreteInfo | null>(null);
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState<string | null>(null);

  // Pagamento
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix');
  const [janelaTempo, setJanelaTempo] = useState('14:00-16:00');

  // Inicializar endereços
  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = async () => {
    try {
      setCarregandoEnderecos(true);
      const resp = await perfilService.listarEnderecos();
      setEnderecos(resp.data);
      if (resp.data.length > 0) {
        setEnderecoSelecionado(resp.data[0].id);
      }
    } catch {
      setEnderecos([]);
    } finally {
      setCarregandoEnderecos(false);
    }
  };

  const calcularFrete = useCallback(async () => {
    if (tipoEntrega === 'retirada') {
      setFrete(null);
      return;
    }

    const endereco = enderecos.find((e) => e.id === enderecoSelecionado);
    if (!endereco) {
      setErroFrete('Selecione um endereço');
      return;
    }

    try {
      setCarregandoFrete(true);
      setErroFrete(null);

      // Mock: sem coordenadas, usar apenas endereço
      const enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;

      const resp = await freteService.calcular({ endereco: enderecoCompleto });
      setFrete(resp.data);
    } catch {
      // Fallback com valor fixo para MVP
      setFrete({ valorFrete: 8.5, prazoEstimadoMinutos: 45 });
      setErroFrete(null);
    } finally {
      setCarregandoFrete(false);
    }
  }, [tipoEntrega, enderecoSelecionado, enderecos]);

  useEffect(() => {
    if (tipoEntrega === 'entrega') {
      calcularFrete();
    } else {
      setFrete(null);
    }
  }, [tipoEntrega, calcularFrete]);

  const adicionarEndereco = async () => {
    const erros: Record<string, string> = {};

    if (!novoEndereco.label.trim()) erros.label = 'Label obrigatório';
    if (!novoEndereco.logradouro.trim()) erros.logradouro = 'Logradouro obrigatório';
    if (!novoEndereco.numero.trim()) erros.numero = 'Número obrigatório';
    if (!novoEndereco.bairro.trim()) erros.bairro = 'Bairro obrigatório';
    if (!novoEndereco.cidade.trim()) erros.cidade = 'Cidade obrigatória';
    if (!novoEndereco.estado.trim()) erros.estado = 'Estado obrigatório';
    if (!novoEndereco.cep.trim()) erros.cep = 'CEP obrigatório';

    if (Object.keys(erros).length > 0) {
      setErrosEndereco(erros);
      return;
    }

    try {
      setSalvandoEndereco(true);
      const resp = await perfilService.criarEndereco(novoEndereco);
      setEnderecos([...enderecos, resp.data]);
      setEnderecoSelecionado(resp.data.id);
      setMostrarFormularioEndereco(false);
      setNovoEndereco({
        label: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: '',
      });
      setErrosEndereco({});
      Alert.alert('Sucesso', 'Endereço adicionado');
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar o endereço');
    } finally {
      setSalvandoEndereco(false);
    }
  };

  const finalizarPedido = async () => {
    // Validações
    if (tipoEntrega === 'entrega' && !enderecoSelecionado) {
      Alert.alert('Erro', 'Selecione um endereço de entrega');
      return;
    }

    if (tipoEntrega === 'entrega' && !frete) {
      Alert.alert('Erro', 'Não foi possível calcular o frete');
      return;
    }

    try {
      setEstado('enviando');

      const endereco = enderecos.find((e) => e.id === enderecoSelecionado);
      const enderecoEntrega =
        tipoEntrega === 'entrega' && endereco
          ? `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`
          : 'Retirada no local';

      const itemsFormatados = itens.map((item) => ({
        produtoId: item.produto.id,
        corte: item.corte,
        pesoKg: item.pesoKg,
      }));

      const subtotal = total();
      const freteValue = tipoEntrega === 'entrega' ? frete!.valorFrete : 0;
      const valorTotal = subtotal + freteValue;

      const resp = await pedidoService.criar({
        itens: itemsFormatados,
        enderecoEntrega,
        janelaEntrega: janelaTempo,
        formaPagamento,
        frete: freteValue,
        valorTotal,
      });

      limpar();

      Alert.alert('Pedido Confirmado!', `Seu pedido #${resp.data.id} foi criado com sucesso.`, [
        {
          text: 'Acompanhar Pedido',
          onPress: () => {
            navigation.getParent()?.navigate('Pedidos', {
              screen: 'Acompanhamento',
              params: { pedidoId: resp.data.id },
            });
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível finalizar o pedido');
      setEstado('editando');
    }
  };

  if (itens.length === 0) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-areia">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={80} color="#6B655A" />
          <Text className="text-ardosia text-lg font-bold mt-6 text-center">
            Carrinho vazio
          </Text>
          <Text className="text-marinha text-sm mt-2 text-center mb-6">
            Adicione produtos antes de fazer checkout
          </Text>
          <AppButton
            label="Voltar"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-areia">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Itens do Carrinho */}
        <View className="px-4 pt-4">
          <Text className="text-ardosia text-lg font-bold mb-3">Resumo do Pedido</Text>

          {itens.map((item) => {
            const itemKey = `${item.produto.id}-${item.corte}`;
            return (
              <View
                key={itemKey}
                className="flex-row items-center rounded-2xl bg-espuma p-3 mb-3 border border-pedra-mar/30"
                style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }}
              >
                {imageErrors[itemKey] || !item.produto.foto ? (
                  <View className="w-16 h-16 rounded-xl bg-pedra-mar/20 items-center justify-center mr-3">
                    <Ionicons name="fish-outline" size={28} color="#6B655A" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.produto.foto }}
                    className="w-16 h-16 rounded-xl mr-3"
                    resizeMode="cover"
                    onError={() => setImageErrors((prev) => ({ ...prev, [itemKey]: true }))}
                    accessibilityLabel={item.produto.especie}
                  />
                )}

                <View className="flex-1">
                  <Text className="text-ardosia font-bold text-base" numberOfLines={1}>
                    {item.produto.especie}
                  </Text>
                  <Text className="text-marinha text-sm mt-0.5">
                    {corteLabel[item.corte] ?? item.corte} &middot; {item.pesoKg.toFixed(1).replace('.', ',')} kg
                  </Text>
                  <Text className="text-terracota text-base font-bold mt-1">
                    {formatCurrency(item.produto.precoPorKg * item.pesoKg)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Tipo de Entrega */}
        <View className="px-4 mt-6">
          <Text className="text-ardosia text-lg font-bold mb-3">Tipo de Entrega</Text>

          <View className="bg-white rounded-xl p-4 border border-pedra-mar">
            <Pressable
              onPress={() => setTipoEntrega('entrega')}
              className="flex-row items-center mb-3"
              accessibilityLabel="Escolher entrega"
              accessibilityRole="radio"
              accessibilityState={{ selected: tipoEntrega === 'entrega' }}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  tipoEntrega === 'entrega'
                    ? 'border-terracota bg-terracota'
                    : 'border-pedra-mar'
                }`}
              >
                {tipoEntrega === 'entrega' && (
                  <Ionicons name="checkmark" size={16} color="#FFFCF7" />
                )}
              </View>
              <Text className="text-ardosia font-semibold">Entrega a domicílio</Text>
            </Pressable>

            <Pressable
              onPress={() => setTipoEntrega('retirada')}
              className="flex-row items-center"
              accessibilityLabel="Escolher retirada"
              accessibilityRole="radio"
              accessibilityState={{ selected: tipoEntrega === 'retirada' }}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  tipoEntrega === 'retirada'
                    ? 'border-terracota bg-terracota'
                    : 'border-pedra-mar'
                }`}
              >
                {tipoEntrega === 'retirada' && (
                  <Ionicons name="checkmark" size={16} color="#FFFCF7" />
                )}
              </View>
              <Text className="text-ardosia font-semibold">Retirada no local</Text>
            </Pressable>
          </View>
        </View>

        {/* Endereço de Entrega */}
        {tipoEntrega === 'entrega' && (
          <View className="px-4 mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-ardosia text-lg font-bold">Endereço de Entrega</Text>
              <Pressable
                onPress={() => setMostrarFormularioEndereco(true)}
                className="flex-row items-center bg-terracota/10 rounded-full px-3 py-1.5"
                accessibilityLabel="Adicionar novo endereço"
                accessibilityRole="button"
              >
                <Ionicons name="add-outline" size={16} color="#D45D4A" />
                <Text className="text-terracota text-sm font-semibold ml-1">Novo</Text>
              </Pressable>
            </View>

            {carregandoEnderecos ? (
              <ActivityIndicator color="#D45D4A" />
            ) : enderecos.length === 0 ? (
              <View className="bg-white rounded-xl p-4 border border-pedra-mar">
                <Text className="text-marinha text-sm text-center">
                  Nenhum endereço salvo. Adicione um para continuar.
                </Text>
              </View>
            ) : (
              <View className="bg-white rounded-xl border border-pedra-mar overflow-hidden">
                {enderecos.map((endereco) => (
                  <Pressable
                    key={endereco.id}
                    onPress={() => setEnderecoSelecionado(endereco.id)}
                    className={`p-4 border-b border-pedra-mar ${
                      enderecoSelecionado === endereco.id ? 'bg-terracota/5' : ''
                    }`}
                    accessibilityLabel={`Selecionar ${endereco.label}`}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: enderecoSelecionado === endereco.id }}
                  >
                    <View className="flex-row items-start">
                      <View
                        className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 items-center justify-center ${
                          enderecoSelecionado === endereco.id
                            ? 'border-terracota bg-terracota'
                            : 'border-pedra-mar'
                        }`}
                      >
                        {enderecoSelecionado === endereco.id && (
                          <Ionicons name="checkmark" size={14} color="#FFFCF7" />
                        )}
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text className="text-ardosia font-bold">{endereco.label}</Text>
                          {endereco.principal && (
                            <Text className="text-espuma bg-terracota px-1.5 py-0.5 rounded text-xs font-bold ml-2">
                              Principal
                            </Text>
                          )}
                        </View>

                        <Text className="text-marinha text-sm mt-1">
                          {endereco.logradouro}, {endereco.numero}
                        </Text>
                        {endereco.complemento && (
                          <Text className="text-marinha text-sm">{endereco.complemento}</Text>
                        )}
                        <Text className="text-marinha text-sm">
                          {endereco.bairro} - {endereco.cidade}, {endereco.estado}
                        </Text>
                        <Text className="text-marinha text-sm">{endereco.cep}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {erroFrete && (
              <Text className="text-coral text-xs mt-2 font-semibold">{erroFrete}</Text>
            )}
          </View>
        )}

        {/* Janela de Horário */}
        <View className="px-4 mt-6">
          <Text className="text-ardosia text-lg font-bold mb-3">Janela de Entrega</Text>

          <View className="bg-white rounded-xl p-4 border border-pedra-mar">
            <View className="flex-row flex-wrap gap-3">
              {['09:00-11:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'].map((janela) => (
                <View key={janela} className="w-[48%]">
                  <Chip
                    label={janela}
                    active={janelaTempo === janela}
                    onPress={() => setJanelaTempo(janela)}
                    accessibilityLabel={`Selecionar horário ${janela}`}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Forma de Pagamento */}
        <View className="px-4 mt-6">
          <Text className="text-ardosia text-lg font-bold mb-3">Forma de Pagamento</Text>

          <View className="bg-white rounded-xl p-4 border border-pedra-mar">
            <Pressable
              onPress={() => setFormaPagamento('pix')}
              className="flex-row items-center mb-4"
              accessibilityLabel="Escolher Pix"
              accessibilityRole="radio"
              accessibilityState={{ selected: formaPagamento === 'pix' }}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  formaPagamento === 'pix' ? 'border-terracota bg-terracota' : 'border-pedra-mar'
                }`}
              >
                {formaPagamento === 'pix' && (
                  <Ionicons name="checkmark" size={16} color="#FFFCF7" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-ardosia font-bold">Pix</Text>
                <Text className="text-marinha text-sm">Transferência bancária instantânea</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => setFormaPagamento('cartao')}
              className="flex-row items-center"
              accessibilityLabel="Escolher Cartão"
              accessibilityRole="radio"
              accessibilityState={{ selected: formaPagamento === 'cartao' }}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  formaPagamento === 'cartao'
                    ? 'border-terracota bg-terracota'
                    : 'border-pedra-mar'
                }`}
              >
                {formaPagamento === 'cartao' && (
                  <Ionicons name="checkmark" size={16} color="#FFFCF7" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-ardosia font-bold">Cartão de Crédito</Text>
                <Text className="text-marinha text-sm">Débito ou crédito</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Resumo Final */}
        <View className="mx-4 mt-6 p-4 bg-white rounded-xl border border-pedra-mar">
          <Text className="text-ardosia text-lg font-bold mb-4">Resumo Final</Text>

          <View className="mb-2 flex-row justify-between">
            <Text className="text-marinha">Subtotal ({itens.length} item{itens.length !== 1 ? 's' : ''})</Text>
            <Text className="text-ardosia font-bold">{formatCurrency(total())}</Text>
          </View>

          {tipoEntrega === 'entrega' && (
            <View className="mb-2 flex-row justify-between">
              <Text className="text-marinha">Frete</Text>
              <Text className="text-ardosia font-bold">
                {carregandoFrete ? 'Calculando...' : formatCurrency(frete?.valorFrete ?? 0)}
              </Text>
            </View>
          )}

          <View className="py-3 my-3 border-t border-b border-pedra-mar flex-row justify-between">
            <Text className="text-ardosia text-lg font-bold">Total</Text>
            <Text className="text-terracota text-2xl font-bold">
              {formatCurrency(total() + (tipoEntrega === 'entrega' ? frete?.valorFrete ?? 0 : 0))}
            </Text>
          </View>

          <AppButton
            label={estado === 'enviando' ? 'Finalizando...' : 'Finalizar Pedido'}
            onPress={finalizarPedido}
            loading={estado === 'enviando'}
            disabled={estado === 'enviando' || carregandoFrete}
            accessibilityLabel="Finalizar pedido"
          />

          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-3 py-3 items-center"
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <Text className="text-terracota font-semibold">Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal de Novo Endereço */}
      <Modal
        visible={mostrarFormularioEndereco}
        animationType="none"
        transparent
        onRequestClose={() => handleFecharEndereco()}
      >
        <View className="flex-1 justify-end">
          <Animated.View
            className="absolute inset-0 bg-black"
            style={{ opacity: enderecoOverlay }}
          />

          <Animated.View
            className="bg-espuma rounded-t-3xl overflow-hidden"
            style={{ height: '85%', transform: [{ translateY: enderecoSheetY }] }}
          >
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-pedra-mar/30">
              <Text className="text-ardosia text-xl font-bold">Novo Endereço</Text>
              <Pressable
                onPress={() => {
                  handleFecharEndereco(() => {
                    setNovoEndereco({
                      label: '', logradouro: '', numero: '', bairro: '',
                      cidade: '', estado: '', cep: '', complemento: '',
                    });
                    setErrosEndereco({});
                  });
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Fechar"
                accessibilityRole="button"
              >
                <Ionicons name="close-outline" size={24} color="#2C241E" />
              </Pressable>
            </View>

            <ScrollView
              className="flex-1 px-5 pt-4"
              contentContainerStyle={{ paddingBottom: 48 }}
              showsVerticalScrollIndicator={false}
            >
              <AppInput
                label="Label (ex: Casa, Trabalho)"
                value={novoEndereco.label}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, label: text })}
                placeholder="Label"
                error={errosEndereco.label}
                accessibilityLabel="Label do endereço"
              />

              <AppInput
                label="Logradouro"
                value={novoEndereco.logradouro}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, logradouro: text })}
                placeholder="Rua, Avenida, etc."
                error={errosEndereco.logradouro}
                accessibilityLabel="Logradouro"
              />

              <AppInput
                label="Número"
                value={novoEndereco.numero}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, numero: text })}
                placeholder="123"
                error={errosEndereco.numero}
                accessibilityLabel="Número"
              />

              <AppInput
                label="Complemento"
                value={novoEndereco.complemento}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, complemento: text })}
                placeholder="Apto 101, Sala 3, etc. (opcional)"
                accessibilityLabel="Complemento"
              />

              <AppInput
                label="Bairro"
                value={novoEndereco.bairro}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, bairro: text })}
                placeholder="Bairro"
                error={errosEndereco.bairro}
                accessibilityLabel="Bairro"
              />

              <AppInput
                label="Cidade"
                value={novoEndereco.cidade}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, cidade: text })}
                placeholder="Cidade"
                error={errosEndereco.cidade}
                accessibilityLabel="Cidade"
              />

              <AppInput
                label="Estado"
                value={novoEndereco.estado}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, estado: text })}
                placeholder="ES"
                accessibilityLabel="Estado"
                error={errosEndereco.estado}
              />

              <AppInput
                label="CEP"
                value={novoEndereco.cep}
                onChangeText={(text) => setNovoEndereco({ ...novoEndereco, cep: text })}
                placeholder="29160-000"
                keyboardType="numeric"
                error={errosEndereco.cep}
                accessibilityLabel="CEP"
              />

              <View className="flex-row gap-3 mt-4">
                <View className="flex-1">
                  <AppButton
                    label="Cancelar"
                    onPress={() => {
                      handleFecharEndereco(() => {
                        setNovoEndereco({
                          label: '', logradouro: '', numero: '', bairro: '',
                          cidade: '', estado: '', cep: '', complemento: '',
                        });
                        setErrosEndereco({});
                      });
                    }}
                    variant="secondary"
                    accessibilityLabel="Cancelar"
                  />
                </View>
                <View className="flex-1">
                  <AppButton
                    label="Salvar"
                    onPress={adicionarEndereco}
                    loading={salvandoEndereco}
                    accessibilityLabel="Salvar endereço"
                  />
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
