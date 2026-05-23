import React from 'react';
import { View, Text } from 'react-native';

interface StepIndicatorProps {
  readonly currentStep: 1 | 2;
  readonly totalSteps: 2;
  readonly labels: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: Readonly<StepIndicatorProps>) {
  return (
    <View
      className="flex-row items-center justify-center my-4 px-8"
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
          : 'text-ardosia';

        return (
          <React.Fragment key={stepNumber}>
            <View className="items-center">
              <View
                className={`w-9 h-9 rounded-full items-center justify-center ${circleClasses}`}
              >
                <Text className={`font-bold text-sm ${textClasses}`}>
                  {stepNumber}
                </Text>
              </View>
              <Text className="text-marinha text-xs mt-1 text-center">
                {labels[index] ?? ''}
              </Text>
            </View>
            {!isLast && (
              <View
                className={`flex-1 h-0.5 mx-2 mb-4 ${
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
