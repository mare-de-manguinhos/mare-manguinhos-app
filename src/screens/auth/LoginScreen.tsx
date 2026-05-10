import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import OceanHeader from '../../components/shared/OceanHeader';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { useAuthStore } from '../../store/authStore';
import { LoginFormState } from '../../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState: LoginFormState = {
  email: '',
  password: '',
  showPassword: false,
  loading: false,
  tentativasFalhas: 0,
  errors: {},
};

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState<LoginFormState>(initialState);

  const bloqueado = form.tentativasFalhas >= 5;

  function validate(): boolean {
    const errors: LoginFormState['errors'] = {};
    if (!form.email.trim()) {
      errors.email = 'Insira seu e-mail';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = 'Insira um e-mail válido';
    }
    if (!form.password) {
      errors.password = 'A senha é obrigatória';
    }
    setForm((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (bloqueado) return;
    if (!validate()) return;

    setForm((prev) => ({ ...prev, loading: true, errors: {} }));
    try {
      await login(form.email.trim(), form.password);
      // RootNavigator reage automaticamente ao token no store
    } catch {
      const newTentativas = form.tentativasFalhas + 1;
      const geralMsg =
        newTentativas >= 5
          ? 'Conta bloqueada temporariamente. Use "Esqueci minha senha".'
          : 'E-mail ou senha incorretos.';
      setForm((prev) => ({
        ...prev,
        loading: false,
        tentativasFalhas: newTentativas,
        errors: { geral: geralMsg },
      }));
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FDF6EC' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OceanHeader
          title="Maré de Manguinhos"
          subtitle="Peixes frescos direto do mar"
        />

        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          {/* Saudação */}
          <Text
            className="text-ardosia font-bold mb-1"
            style={{ fontSize: 24 }}
          >
            Bem-vindo de volta!
          </Text>
          <Text className="text-marinha text-sm mb-6">
            Entre com seus dados para continuar
          </Text>

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
            {/* Barra de acento no topo do card */}
            <View className="bg-mar" style={{ height: 4 }} />

            <View style={{ padding: 24 }}>
              <AppInput
                label="E-mail"
                value={form.email}
                onChangeText={(v) =>
                  setForm((prev) => ({ ...prev, email: v, errors: {} }))
                }
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={form.errors.email}
                accessibilityLabel="Campo de e-mail"
                accessibilityHint="Digite seu endereço de e-mail"
                editable={!form.loading}
              />

              <AppInput
                label="Senha"
                value={form.password}
                onChangeText={(v) =>
                  setForm((prev) => ({ ...prev, password: v, errors: {} }))
                }
                placeholder="Sua senha"
                secureTextEntry={!form.showPassword}
                onToggleSecure={() =>
                  setForm((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                error={form.errors.password}
                accessibilityLabel="Campo de senha"
                accessibilityHint="Digite sua senha"
                editable={!form.loading}
              />

              <Pressable
                onPress={() =>
                  Alert.alert(
                    'Esqueci minha senha',
                    'Em breve você receberá instruções de recuperação de senha no seu e-mail.',
                  )
                }
                className="mb-5 self-end"
                accessibilityLabel="Esqueci minha senha"
                accessibilityRole="link"
              >
                <Text className="text-oceano text-sm font-medium">
                  Esqueci minha senha
                </Text>
              </Pressable>

              {/* Bloco de bloqueio condicional */}
              {bloqueado && (
                <View
                  className="rounded-2xl p-4 mb-4"
                  style={{ backgroundColor: '#FFF3CD', borderWidth: 1, borderColor: '#F2A23A' }}
                >
                  <Text className="text-ardosia text-sm text-center">
                    🔒 Muitas tentativas falhas. Use "Esqueci minha senha" para
                    recuperar o acesso.
                  </Text>
                </View>
              )}

              {form.errors.geral && !bloqueado && (
                <Text
                  className="text-coral text-sm text-center mb-4"
                  accessibilityRole="alert"
                >
                  {form.errors.geral}
                </Text>
              )}

              <AppButton
                label="Entrar"
                onPress={handleSubmit}
                loading={form.loading}
                disabled={bloqueado}
                variant="primary"
                accessibilityLabel="Entrar na conta"
              />
            </View>
          </View>

          {/* Divisor */}
          <View className="flex-row items-center my-6">
            <View className="flex-1" style={{ height: 1, backgroundColor: '#B8D4DC' }} />
            <Text className="text-marinha text-xs mx-3">ou</Text>
            <View className="flex-1" style={{ height: 1, backgroundColor: '#B8D4DC' }} />
          </View>

          {/* Link de cadastro */}
          <Pressable
            onPress={() => navigation.navigate('Register')}
            className="self-center mb-2"
            accessibilityLabel="Ir para cadastro"
            accessibilityRole="link"
          >
            <Text className="text-marinha text-sm">
              Ainda não tem conta?{'  '}
              <Text className="text-mar font-bold">Criar conta grátis</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
