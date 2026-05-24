import React from 'react';
import { View, Text } from 'react-native';

interface StepIndicatorProps {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly labels: string[];
}

/**
 * Indicador de etapas para acompanhamento de pedidos.
 * Renderiza uma linha de tempo com círculos numerados e rótulos descritivos.
 */
export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: Readonly<StepIndicatorProps>) {
  return (
    <View
      className="flex-row items-center justify-center my-4 px-4"
      accessibilityLabel={`Etapa ${currentStep} de ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        const isLast = stepNumber === totalSteps;

        const circleClasses = isActive || isCompleted
          ? 'bg-terracota'
          : 'bg-pedra-mar';
        const textClasses = isActive || isCompleted
          ? 'text-espuma'
          : 'text-marinha';

        return (
          <React.Fragment key={stepNumber}>
            <View className="items-center flex-1">
              {/* Círculo do Passo */}
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${circleClasses}`}
              >
                <Text className={`font-bold text-xs ${textClasses}`}>
                  {stepNumber}
                </Text>
              </View>
              
              {/* Rótulo do Passo */}
              <View className="h-10 justify-center">
                <Text 
                  className={`text-[10px] mt-1 text-center font-medium leading-tight ${
                    isActive ? 'text-ardosia' : 'text-marinha'
                  }`}
                  numberOfLines={2}
                >
                  {labels[index] ?? ''}
                </Text>
              </View>
            </View>
            
            {/* Linha Conectora */}
            {!isLast && (
              <View
                className={`flex-1 h-0.5 mb-10 ${
                  isCompleted ? 'bg-terracota' : 'bg-pedra-mar'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
