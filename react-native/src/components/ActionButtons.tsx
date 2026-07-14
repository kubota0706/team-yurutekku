import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import { actionButtonStyles } from '@/styles/actionButtonStyle';

type ActionButtonsProps = {
  onNext: () => void;
  nextLabel: string;
  onBack?: () => void;
  backLabel?: string;
  showBack?: boolean;
  centered?: boolean;
  setStyle?: StyleProp<ViewStyle>;
};

export const ActionButtons = ({
  onNext,
  nextLabel,
  onBack,
  backLabel = '戻る',
  showBack = false,
  centered = false,
  setStyle,
}: ActionButtonsProps) => {
  if (centered && !showBack) {
    return (
      <View style={[actionButtonStyles.centeredRow, setStyle || null]}>
        <TouchableOpacity
          style={[actionButtonStyles.nextButton, actionButtonStyles.nextButtonSingle]}
          onPress={onNext}
        >
          <Text style={actionButtonStyles.nextButtonText}>{nextLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[actionButtonStyles.buttonRow, setStyle || null]}>
      {showBack ? (
        <TouchableOpacity style={actionButtonStyles.backButton} onPress={onBack}>
          <Text style={actionButtonStyles.backButtonText}>{backLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={actionButtonStyles.placeholder} />
      )}
      <TouchableOpacity style={actionButtonStyles.nextButton} onPress={onNext}>
        <Text style={actionButtonStyles.nextButtonText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};