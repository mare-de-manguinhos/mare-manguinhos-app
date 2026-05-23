import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import OceanHeader from '../../components/shared/OceanHeader';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import StepIndicator from '../../components/ui/StepIndicator';
import { useAuthStore } from '../../store/authStore';
import { BasicFormState, AddressFormState, RegisterStep } from '../../types';
import { formatBrazilianPhone, rawPhone } from '../../utils/formatPhone';
import { formatCEP, rawCEP } from '../../utils/formatCEP';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialBasic: BasicFormState = {
  nome: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
  telefone: '',
  showPassword: false,
  showConfirmPassword: false,
  errors: {},
};

const initialAddress: AddressFormState = {
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  loading: false,
  errors: {},
};

export default function RegisterScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const register = useAuthStore((s) => s.register);

  const scrollViewRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState<RegisterStep>(1);
  const [basic, setBasic] = useState<BasicFormState>(initialBasic);
  const [address, setAddress] = useState<AddressFormState>(initialAddress);

  // ── Step 1 validation ────────────────────────────────────────────────────

  function handleStep1Submit() {
    const errors: BasicFormState['errors'] = {};
    if (!basic.nome.trim() || basic.nome.trim().length < 3) {
      errors.nome = 'Insira seu nome completo';
    }
    if (!basic.email.trim() || !EMAIL_REGEX.test(basic.email.trim())) {
      errors.email = 'Insira um e-mail válido';
    }
    if (basic.confirmEmail.trim() !== basic.email.trim()) {
      errors.confirmEmail = 'Os e-mails não coincidem';
    }
    if (!basic.password || basic.password.length < 8) {
      errors.password = 'A senha deve ter no mínimo 8 caracteres';
    }
    if (basic.confirmPassword !== basic.password) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
    if (rawPhone(basic.telefone).length < 10) {
      errors.telefone = 'Insira um telefone com DDD válido';
    }

    if (Object.keys(errors).length > 0) {
      setBasic((prev) => ({ ...prev, errors }));
      return;
    }

    setCurrentStep(2);
    setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 50);
  }

  // ── Step 2 submit ─────────────────────────────────────────────────────────

  async function handleRegisterSubmit() {
    const errors: AddressFormState['errors'] = {};
    if (rawCEP(address.cep).length < 8) {
      errors.cep = 'Insira um CEP válido';
    }
    if (!address.logradouro.trim()) {
      errors.logradouro = 'Insira o logradouro';
    }
    if (!address.numero.trim()) {
      errors.numero = 'Insira o número';
    }
    if (!address.bairro.trim()) {
      errors.bairro = 'Insira o bairro';
    }
    if (!address.cidade.trim()) {
      errors.cidade = 'Insira a cidade';
    }
    if (!address.estado.trim()) {
      errors.estado = 'Insira o estado';
    }

    if (Object.keys(errors).length > 0) {
      setAddress((prev) => ({ ...prev, errors }));
      return;
    }

    setAddress((prev) => ({ ...prev, loading: true, errors: {} }));
    try {
      await register({
        nome: basic.nome.trim(),
        email: basic.email.trim(),
        telefone: rawPhone(basic.telefone),
        password: basic.password,
        endereco: {
          logradouro: address.logradouro.trim(),
          numero: address.numero.trim(),
          complemento: address.complemento.trim() || undefined,
          bairro: address.bairro.trim(),
          cidade: address.cidade.trim(),
          estado: address.estado.trim(),
          cep: rawCEP(address.cep),
        },
      });
      // RootNavigator reage automaticamente ao token no store
    } catch {
      // Mock 409 — e-mail duplicado: retornar para Etapa 1 com erro inline
      setAddress((prev) => ({ ...prev, loading: false }));
      setBasic((prev) => ({
        ...prev,
        errors: { email: 'Este e-mail já está cadastrado' },
      }));
      setCurrentStep(1);
      setTimeout(() => scrollViewRef.current?.scrollTo({ y: 0, animated: true }), 50);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: '#FDF6EC' }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OceanHeader title="Criar conta" subtitle="Preencha seus dados abaixo" />

        <StepIndicator
          currentStep={currentStep}
          totalSteps={2}
          labels={['Dados', 'Endereço']}
        />

        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          {/* Card do formulário */}
          <View
            className="bg-espuma rounded-3xl"
            style={{
              shadowColor: '#1C3A47',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.14,
              shadowRadius: 16,
              elevation: 6,
              overflow: 'hidden',
            }}
          >
            {/* Barra de acento no topo — muda com o step */}
            <View
              style={{
                height: 4,
                backgroundColor: currentStep === 1 ? '#1A5F7A' : '#3A9E6A',
              }}
            />

            <View style={{ padding: 24 }}>
              {currentStep === 1 ? (
              /* ── Etapa 1: Dados Básicos ─────────────────────────────── */
              <>
                <Text
                  className="text-ardosia font-bold mb-1"
                  style={{ fontSize: 18 }}
                >
                  Seus dados pessoais
                </Text>
                <Text className="text-marinha text-xs mb-5">
                  Campos marcados são obrigatórios
                </Text>

                <AppInput
                  label="Nome completo"
                  value={basic.nome}
                  onChangeText={(v) =>
                    setBasic((prev) => ({ ...prev, nome: v, errors: { ...prev.errors, nome: undefined } }))
                  }
                  placeholder="Seu nome completo"
                  autoCapitalize="words"
                  error={basic.errors.nome}
                  accessibilityLabel="Campo de nome completo"
                  accessibilityHint="Digite seu nome completo"
                />

                <AppInput
                  label="E-mail"
                  value={basic.email}
                  onChangeText={(v) =>
                    setBasic((prev) => ({ ...prev, email: v, errors: { ...prev.errors, email: undefined } }))
                  }
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={basic.errors.email}
                  accessibilityLabel="Campo de e-mail"
                  accessibilityHint="Digite seu endereço de e-mail"
                />

                <AppInput
                  label="Confirmar e-mail"
                  value={basic.confirmEmail}
                  onChangeText={(v) =>
                    setBasic((prev) => ({ ...prev, confirmEmail: v, errors: { ...prev.errors, confirmEmail: undefined } }))
                  }
                  placeholder="Confirme seu e-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={basic.errors.confirmEmail}
                  accessibilityLabel="Campo de confirmação de e-mail"
                  accessibilityHint="Digite novamente seu endereço de e-mail"
                />

                <AppInput
                  label="Senha"
                  value={basic.password}
                  onChangeText={(v) =>
                    setBasic((prev) => ({ ...prev, password: v, errors: { ...prev.errors, password: undefined } }))
                  }
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry={!basic.showPassword}
                  onToggleSecure={() =>
                    setBasic((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                  }
                  error={basic.errors.password}
                  accessibilityLabel="Campo de senha"
                  accessibilityHint="Digite uma senha com no mínimo 8 caracteres"
                />

                <AppInput
                  label="Confirmar senha"
                  value={basic.confirmPassword}
                  onChangeText={(v) =>
                    setBasic((prev) => ({ ...prev, confirmPassword: v, errors: { ...prev.errors, confirmPassword: undefined } }))
                  }
                  placeholder="Repita sua senha"
                  secureTextEntry={!basic.showConfirmPassword}
                  onToggleSecure={() =>
                    setBasic((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))
                  }
                  error={basic.errors.confirmPassword}
                  accessibilityLabel="Campo de confirmação de senha"
                  accessibilityHint="Digite novamente sua senha"
                />

                <AppInput
                  label="Telefone (WhatsApp)"
                  value={basic.telefone}
                  onChangeText={(v) =>
                    setBasic((prev) => ({
                      ...prev,
                      telefone: formatBrazilianPhone(v),
                      errors: { ...prev.errors, telefone: undefined },
                    }))
                  }
                  placeholder="(27) 99999-9999"
                  keyboardType="phone-pad"
                  error={basic.errors.telefone}
                  accessibilityLabel="Campo de telefone"
                  accessibilityHint="Digite seu número de telefone com DDD"
                />

                <AppButton
                  label="Próximo →"
                  onPress={handleStep1Submit}
                  variant="primary"
                  accessibilityLabel="Avançar para endereço"
                />

                <Pressable
                  onPress={() => navigation.goBack()}
                  style={{ marginTop: 16, alignSelf: 'center' }}
                  accessibilityLabel="Ir para login"
                  accessibilityRole="link"
                >
                  <Text className="text-marinha text-sm">
                    Já tenho conta?{' '}
                    <Text className="text-mar font-bold">Entrar</Text>
                  </Text>
                </Pressable>
              </>
            ) : (
              /* ── Etapa 2: Endereço ──────────────────────────────────── */
              <>
                <Text
                  className="text-ardosia font-bold mb-1"
                  style={{ fontSize: 18 }}
                >
                  Seu endereço de entrega
                </Text>
                <Text className="text-marinha text-xs mb-5">
                  Usaremos para entregar seus pedidos
                </Text>

                <AppInput
                  label="CEP"
                  value={address.cep}
                  onChangeText={(v) =>
                    setAddress((prev) => ({
                      ...prev,
                      cep: formatCEP(v),
                      errors: { ...prev.errors, cep: undefined },
                    }))
                  }
                  placeholder="00000-000"
                  keyboardType="numeric"
                  error={address.errors.cep}
                  accessibilityLabel="Campo de CEP"
                  accessibilityHint="Digite seu CEP com 8 dígitos"
                />

                <AppInput
                  label="Logradouro / Rua"
                  value={address.logradouro}
                  onChangeText={(v) =>
                    setAddress((prev) => ({ ...prev, logradouro: v, errors: { ...prev.errors, logradouro: undefined } }))
                  }
                  placeholder="Nome da rua ou avenida"
                  autoCapitalize="words"
                  error={address.errors.logradouro}
                  accessibilityLabel="Campo de logradouro"
                  accessibilityHint="Digite o nome da sua rua ou avenida"
                />

                <AppInput
                  label="Número"
                  value={address.numero}
                  onChangeText={(v) =>
                    setAddress((prev) => ({ ...prev, numero: v, errors: { ...prev.errors, numero: undefined } }))
                  }
                  placeholder="Ex: 123"
                  keyboardType="numeric"
                  error={address.errors.numero}
                  accessibilityLabel="Campo de número"
                  accessibilityHint="Digite o número do imóvel"
                />

                <AppInput
                  label="Complemento (opcional)"
                  value={address.complemento}
                  onChangeText={(v) =>
                    setAddress((prev) => ({ ...prev, complemento: v }))
                  }
                  placeholder="Apto, Bloco, Casa..."
                  autoCapitalize="sentences"
                  accessibilityLabel="Campo de complemento"
                  accessibilityHint="Campo opcional para complemento do endereço"
                />

                <AppInput
                  label="Bairro"
                  value={address.bairro}
                  onChangeText={(v) =>
                    setAddress((prev) => ({ ...prev, bairro: v, errors: { ...prev.errors, bairro: undefined } }))
                  }
                  placeholder="Seu bairro"
                  autoCapitalize="words"
                  error={address.errors.bairro}
                  accessibilityLabel="Campo de bairro"
                  accessibilityHint="Digite o nome do seu bairro"
                />

                <AppInput
                  label="Cidade"
                  value={address.cidade}
                  onChangeText={(v) =>
                    setAddress((prev) => ({ ...prev, cidade: v, errors: { ...prev.errors, cidade: undefined } }))
                  }
                  placeholder="Sua cidade"
                  autoCapitalize="words"
                  error={address.errors.cidade}
                  accessibilityLabel="Campo de cidade"
                  accessibilityHint="Digite o nome da sua cidade"
                />

                <AppInput
                  label="Estado / UF"
                  value={address.estado}
                  onChangeText={(v) =>
                    setAddress((prev) => ({ ...prev, estado: v.toUpperCase().slice(0, 2), errors: { ...prev.errors, estado: undefined } }))
                  }
                  placeholder="Ex: ES"
                  autoCapitalize="characters"
                  error={address.errors.estado}
                  accessibilityLabel="Campo de estado"
                  accessibilityHint="Digite a sigla do seu estado com 2 letras"
                />

                {address.errors.geral ? (
                  <Text
                    className="text-coral text-sm text-center mb-4"
                    accessibilityRole="alert"
                  >
                    {address.errors.geral}
                  </Text>
                ) : null}

                <AppButton
                  label="Criar conta"
                  onPress={handleRegisterSubmit}
                  loading={address.loading}
                  variant="primary"
                  accessibilityLabel="Criar minha conta"
                />

                <Pressable
                  onPress={() => setCurrentStep(1)}
                  style={{ marginTop: 16, alignSelf: 'center' }}
                  accessibilityLabel="Voltar para dados pessoais"
                  accessibilityRole="button"
                >
                  <Text className="text-marinha text-sm font-medium">
                    ← Voltar
                  </Text>
                </Pressable>
              </>
            )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
