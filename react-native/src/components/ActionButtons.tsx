import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { actionButtonStyles } from '@/styles/actionButtonStyle';

type ActionButtonsProps = {
  onNext: () => void;
  nextLabel: string;
  onBack?: () => void;
  backLabel?: string;
  showBack?: boolean;
};

export const ActionButtons = ({
  onNext,
  nextLabel,
  onBack,
  backLabel = '戻る',
  showBack = false,
}: ActionButtonsProps) => {
  return (
    <View style={actionButtonStyles.buttonRow}>
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

