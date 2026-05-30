import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { perfilService } from '../../services/perfilService';
import { Endereco, Usuario } from '../../types';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import { buscarCep } from '../../services/cepService';
import { formatCEP, rawCEP } from '../../utils/formatCEP';

type Estado = 'carregando' | 'editando' | 'listando' | 'criando_endereco' | 'erro';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const { logout, usuario: usuarioLogado } = useAuthStore();

  const [estado, setEstado] = useState<Estado>('carregando');
  const [refreshing, setRefreshing] = useState(false);

  // Dados do usuário
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);

  // Formulário de edição
  const [nomeEditado, setNomeEditado] = useState('');
  const [telefoneEditado, setTelefoneEditado] = useState('');
  const [loadingAtualizacao, setLoadingAtualizacao] = useState(false);

  // Formulário de novo endereço
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
  const [loadingEndereco, setLoadingEndereco] = useState(false);
  const [errosEndereco, setErrosEndereco] = useState<Record<string, string>>({});
  const [cepLoading, setCepLoading] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [perfil, enderecosLista] = await Promise.all([
        perfilService.buscar(),
        perfilService.listarEnderecos(),
      ]);

      setUsuario(perfil);
      setEnderecos(enderecosLista);
      setNomeEditado(perfil.nome);
      setTelefoneEditado(perfil.telefone);
      setEstado('listando');
    } catch (error: any) {
      console.log('❌ Erro ao carregar perfil:', error);
      if (error.response) {
        console.log('   Status HTTP:', error.response.status);
        console.log('   URL:', error.config?.url);
        console.log('   Dados:', error.response.data);
      } else if (error.request) {
        console.log('   ⚠️ Nenhuma resposta do servidor');
        console.log('   URL da API:', error.config?.baseURL);
      } else {
        console.log('   Mensagem:', error.message);
      }
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

  // ── CEP auto-fill (ViaCEP) ──────────────────────────────────────────────

  useEffect(() => {
    const raw = rawCEP(novoEndereco.cep);
    if (raw.length !== 8) return;

    let ignore = false;
    setCepLoading(true);
    buscarCep(raw).then((data) => {
      if (ignore) return;
      if (data) {
        setNovoEndereco((prev) => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
        }));
      }
      setCepLoading(false);
    });

    return () => { ignore = true; };
  }, [novoEndereco.cep]);

  const handleAtualizarPerfil = async () => {
    if (!nomeEditado.trim()) {
      Alert.alert('Erro', 'Nome não pode estar vazio');
      return;
    }

    setLoadingAtualizacao(true);
    try {
      const perfilAtualizado = await perfilService.atualizar({
        nome: nomeEditado,
        telefone: telefoneEditado,
      });
      setUsuario(perfilAtualizado);
      setEstado('listando');
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoadingAtualizacao(false);
    }
  };

  const handleCriarEndereco = async () => {
    const erros: Record<string, string> = {};

    if (!novoEndereco.label.trim()) erros.label = 'Insira uma label (ex: Casa, Trabalho)';
    if (!novoEndereco.logradouro.trim()) erros.logradouro = 'Insira o logradouro';
    if (!novoEndereco.numero.trim()) erros.numero = 'Insira o número';
    if (!novoEndereco.bairro.trim()) erros.bairro = 'Insira o bairro';
    if (!novoEndereco.cidade.trim()) erros.cidade = 'Insira a cidade';
    if (!novoEndereco.estado.trim()) erros.estado = 'Insira o estado';
    if (rawCEP(novoEndereco.cep).length < 8) erros.cep = 'Insira um CEP válido';

    if (Object.keys(erros).length > 0) {
      setErrosEndereco(erros);
      return;
    }

    setLoadingEndereco(true);
    try {
      const enderecoCriado = await perfilService.criarEndereco(novoEndereco);
      setEnderecos([...enderecos, enderecoCriado]);
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
      setEstado('listando');
      Alert.alert('Sucesso', 'Endereço criado com sucesso');
    } catch {
      Alert.alert('Erro', 'Não foi possível criar o endereço');
    } finally {
      setLoadingEndereco(false);
    }
  };

  const handleRemoverEndereco = (enderecoId: string) => {
    Alert.alert('Remover endereço', 'Tem certeza que deseja remover este endereço?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await perfilService.removerEndereco(enderecoId);
            setEnderecos(enderecos.filter((e) => e.id !== enderecoId));
            Alert.alert('Sucesso', 'Endereço removido com sucesso');
          } catch {
            Alert.alert('Erro', 'Não foi possível remover o endereço');
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Tem certeza que deseja fazer logout?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  if (estado === 'carregando' && !usuario) {
    return (
      <View className="flex-1 items-center justify-center bg-areia" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" color="#D45D4A" />
      </View>
    );
  }

  if (estado === 'erro' && !usuario) {
    return (
      <View className="flex-1 items-center justify-center bg-areia px-6" style={{ paddingTop: insets.top }}>
        <Text className="text-ardosia text-lg font-bold text-center mb-2">
          Erro ao carregar perfil
        </Text>
        <Text className="text-marinha text-sm text-center mb-6">
          Verifique sua conexão e tente novamente
        </Text>
        <Pressable
          onPress={carregar}
          className="rounded-xl bg-terracota px-10 py-4"
          accessibilityLabel="Tentar novamente"
          accessibilityRole="button"
        >
          <Text className="text-espuma font-semibold text-base">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-areia">
      <View
        className="bg-oceano px-5 pb-6 rounded-b-3xl"
        style={{
          paddingTop: insets.top + 12,
          shadowColor: '#3A9D8F',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text className="text-espuma text-2xl font-bold">Meu Perfil</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D45D4A" />
        }
      >
        {/* Seção: Dados do Usuário */}
        <View className="px-4 py-6 bg-white rounded-xl mx-4 mt-4">
          <Text className="text-ardosia text-lg font-bold mb-4">Meus Dados</Text>

          {estado === 'editando' ? (
            <>
              <AppInput
                label="Nome"
                value={nomeEditado}
                onChangeText={setNomeEditado}
                placeholder="Seu nome completo"
                accessibilityLabel="Nome"
              />
              <AppInput
                label="Telefone"
                value={telefoneEditado}
                onChangeText={setTelefoneEditado}
                placeholder="(27) 99999-9999"
                keyboardType="phone-pad"
                accessibilityLabel="Telefone"
              />
              <AppInput
                label="E-mail (somente leitura)"
                value={usuario?.email || ''}
                onChangeText={() => {}}
                editable={false}
                accessibilityLabel="E-mail"
              />

              <View className="flex-row gap-3 mt-4">
                <View className="flex-1">
                  <AppButton
                    label="Cancelar"
                    onPress={() => {
                      setNomeEditado(usuario?.nome || '');
                      setTelefoneEditado(usuario?.telefone || '');
                      setEstado('listando');
                    }}
                    variant="secondary"
                    accessibilityLabel="Cancelar edição"
                  />
                </View>
                <View className="flex-1">
                  <AppButton
                    label="Salvar"
                    onPress={handleAtualizarPerfil}
                    loading={loadingAtualizacao}
                    accessibilityLabel="Salvar alterações"
                  />
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="mb-3">
                <Text className="text-marinha text-sm font-medium mb-1">Nome</Text>
                <Text className="text-ardosia text-base">{usuario?.nome}</Text>
              </View>
              <View className="mb-3">
                <Text className="text-marinha text-sm font-medium mb-1">E-mail</Text>
                <Text className="text-ardosia text-base">{usuario?.email}</Text>
              </View>
              <View className="mb-4">
                <Text className="text-marinha text-sm font-medium mb-1">Telefone</Text>
                <Text className="text-ardosia text-base">{usuario?.telefone || 'Não informado'}</Text>
              </View>

              <AppButton
                label="Editar Dados"
                onPress={() => setEstado('editando')}
                variant="outline"
                accessibilityLabel="Editar dados pessoais"
              />
            </>
          )}
        </View>

        {/* Seção: Endereços */}
        {estado === 'listando' && (
          <View className="px-4 py-6 bg-white rounded-xl mx-4 my-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-ardosia text-lg font-bold">Meus Endereços</Text>
              <Pressable
                onPress={() => setEstado('criando_endereco')}
                accessibilityLabel="Adicionar novo endereço"
                accessibilityRole="button"
                className="flex-row items-center bg-terracota/10 rounded-full px-3 py-1.5"
              >
                <Ionicons name="add-outline" size={18} color="#D45D4A" />
                <Text className="text-terracota text-sm font-semibold ml-1">Novo</Text>
              </Pressable>
            </View>

            {enderecos.length === 0 ? (
              <Text className="text-marinha text-sm text-center py-6">
                Nenhum endereço cadastrado
              </Text>
            ) : (
              enderecos.map((endereco) => (
                <View
                  key={endereco.id}
                  className="mb-4 p-3 bg-areia rounded-lg border border-pedra-mar"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <Text className="text-ardosia font-semibold text-base">{endereco.label}</Text>
                    {endereco.principal && (
                      <Text className="text-espuma bg-terracota px-2 py-1 rounded text-xs font-semibold">
                        Principal
                      </Text>
                    )}
                  </View>

                  <Text className="text-marinha text-sm mb-1">
                    {endereco.logradouro}, {endereco.numero}
                  </Text>
                  {endereco.complemento && (
                    <Text className="text-marinha text-sm mb-1">{endereco.complemento}</Text>
                  )}
                  <Text className="text-marinha text-sm mb-1">
                    {endereco.bairro} - {endereco.cidade}, {endereco.estado}
                  </Text>
                  <Text className="text-marinha text-sm mb-3">{endereco.cep}</Text>

                  <AppButton
                    label="Remover"
                    onPress={() => handleRemoverEndereco(endereco.id)}
                    variant="outline"
                    accessibilityLabel={`Remover endereço ${endereco.label}`}
                  />
                </View>
              ))
            )}
          </View>
        )}

        {/* Formulário de Novo Endereço */}
        {estado === 'criando_endereco' && (
          <View className="px-4 py-6 bg-white rounded-xl mx-4 my-4">
            <Text className="text-ardosia text-lg font-bold mb-4">Novo Endereço</Text>

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
              onChangeText={(text) => {
                setNovoEndereco((prev) => ({ ...prev, cep: formatCEP(text) }));
                setErrosEndereco((prev) => { const n = { ...prev }; delete n.cep; return n; });
              }}
              placeholder="29160-000"
              keyboardType="numeric"
              error={errosEndereco.cep}
              accessibilityLabel="CEP"
              editable={!cepLoading}
            />

            <View className="flex-row gap-3 mt-4">
              <View className="flex-1">
                <AppButton
                  label="Cancelar"
                  onPress={() => {
                    setEstado('listando');
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
                  }}
                  variant="secondary"
                  accessibilityLabel="Cancelar criação de endereço"
                />
              </View>
              <View className="flex-1">
                <AppButton
                  label="Criar"
                  onPress={handleCriarEndereco}
                  loading={loadingEndereco}
                  accessibilityLabel="Criar novo endereço"
                />
              </View>
            </View>
          </View>
        )}

        {/* Botão de Logout */}
        {estado === 'listando' && (
          <View className="px-4 py-4">
              <AppButton
                label="Sair da conta"
                onPress={handleLogout}
                variant="outline"
                accessibilityLabel="Sair da conta"
              />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
