import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCarrinhoStore } from '../../store/carrinhoStore';
import AppButton from '../../components/ui/AppButton';

export default function CarrinhoScreen() {
  const { itens, removerItem, total } = useCarrinhoStore();
  const navigation = useNavigation<any>();

  if (itens.length === 0) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 items-center justify-center bg-areia px-6">
        <Ionicons name="cart-outline" size={80} color="#6B655A" />
        <Text className="text-ardosia text-lg font-bold mt-6 text-center">
          Seu carrinho está vazio
        </Text>
        <Text className="text-marinha text-sm mt-2 text-center">
          Explore os produtos disponíveis e adicione itens ao carrinho
        </Text>
        <View className="mt-8 w-full">
          <AppButton
            label="Ver produtos"
            onPress={() => navigation.navigate('Vitrine')}
            accessibilityLabel="Ver produtos disponíveis"
          />
        </View>
      </SafeAreaView>
    );
  }

  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-areia">
      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Itens do carrinho"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {itens.map((item, index) => (
          <ItemCard
            key={`${item.produto.id}-${item.corte}-${index}`}
            item={item}
            onRemove={() => removerItem(item.produto.id, item.corte)}
            formatCurrency={formatCurrency}
          />
        ))}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-5 pb-8 pt-4"
        style={{ borderTopWidth: 1, borderTopColor: '#D6CFC4' }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-ardosia text-base font-semibold">Subtotal</Text>
          <Text className="text-terracota text-2xl font-bold">
            {formatCurrency(total())}
          </Text>
        </View>
        <AppButton
          label="Ir para Checkout"
          onPress={() => {
            try {
              navigation.navigate('Checkout');
            } catch {
              // CheckoutScreen ainda não existe
            }
          }}
          accessibilityLabel={`Ir para checkout, total ${formatCurrency(total())}`}
        />
      </View>
    </SafeAreaView>
  );
}

interface ItemCardProps {
  item: { produto: { id: string; especie: string; foto: string; precoPorKg: number }; corte: string; pesoKg: number };
  onRemove: () => void;
  formatCurrency: (value: number) => string;
}

function ItemCard({ item, onRemove, formatCurrency }: ItemCardProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [removing, setRemoving] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleRemove = () => {
    setRemoving(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onRemove();
    });
  };

  if (removing) {
    return (
      <Animated.View style={{ opacity: fadeAnim, marginBottom: 12 }}>
        <View className="rounded-2xl bg-espuma p-3 border border-pedra-mar/30"
          style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }}
        >
          <View className="h-16 w-16 rounded-xl bg-pedra-mar/20" />
          <View className="flex-1 ml-3" />
        </View>
      </Animated.View>
    );
  }

  const corteLabel: Record<string, string> = {
    inteiro: 'Inteiro',
    limpo: 'Limpo',
    file: 'Filé',
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, marginBottom: 12 }}>
      <View
        className="flex-row items-center rounded-2xl bg-espuma p-3 border border-pedra-mar/30"
        style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }}
      >
        {imageError ? (
          <View className="h-16 w-16 rounded-xl bg-pedra-mar/20 items-center justify-center">
            <Ionicons name="fish-outline" size={28} color="#6B655A" />
          </View>
        ) : (
          <Image
            source={{ uri: item.produto.foto }}
            className="h-16 w-16 rounded-xl"
            resizeMode="cover"
            onError={() => setImageError(true)}
            accessibilityLabel={item.produto.especie}
          />
        )}

        <View className="flex-1 ml-3">
          <Text className="text-ardosia text-base font-bold" numberOfLines={1}>
            {item.produto.especie}
          </Text>
          <Text className="text-marinha text-sm mt-0.5">
            {corteLabel[item.corte] ?? item.corte} &middot; {item.pesoKg.toFixed(1).replace('.', ',')} kg
          </Text>
          <Text className="text-terracota text-base font-bold mt-1">
            {formatCurrency(item.produto.precoPorKg * item.pesoKg)}
          </Text>
        </View>

        <Pressable
          onPress={handleRemove}
          className="h-11 w-11 items-center justify-center rounded-full"
          accessibilityLabel={`Remover ${item.produto.especie} ${corteLabel[item.corte] ?? item.corte}`}
          accessibilityRole="button"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Ionicons name="trash-outline" size={22} color="#D64550" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
