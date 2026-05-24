import React from 'react';
import { View } from 'react-native';
import { Corte } from '../../types';
import Chip from '../ui/Chip';

const nomesCorte: Record<Corte, string> = {
  inteiro: 'Inteiro',
  limpo: 'Limpo',
  file: 'Filé',
};

interface Props {
  cortes: Corte[];
  selecionado: Corte;
  onSelect: (corte: Corte) => void;
}

export default function CorteChip({ cortes, selecionado, onSelect }: Props) {
  if (cortes.length <= 1) return null;

  return (
    <View className="flex-row flex-wrap gap-2">
      {cortes.map((corte) => (
        <Chip
          key={corte}
          label={nomesCorte[corte]}
          active={corte === selecionado}
          onPress={() => onSelect(corte)}
          accessibilityLabel={`Corte ${nomesCorte[corte]}${corte === selecionado ? ', selecionado' : ''}`}
        />
      ))}
    </View>
  );
}
