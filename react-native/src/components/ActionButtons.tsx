import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ActionButtonsProps = {
  onNext: () => void;
  nextLabel: string;
  onBack?: () => void;
  backLabel?: string;
  showBack?: boolean;
};

const ActionButtons = ({
  onNext,
  nextLabel,
  onBack,
  backLabel = '戻る',
  showBack = false,
}: ActionButtonsProps) => {
  return (
    <View style={styles.buttonRow}>
      {showBack ? (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>{backLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextButtonText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  placeholder: {
    flex: 1,
  },
  backButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4293FF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4293FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#4293FF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default ActionButtons;
