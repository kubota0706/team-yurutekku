// components/SelectionTrigger.tsx
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerStyles as styles } from '@/styles/profileRegisterBaseStyles';

interface Props {
  value: string;
  placeholder: string;
  onPress: () => void;
  containerStyle?: ViewStyle; // ここで幅などを上書き可能にする
  other?: string;
}

export const SelectionTrigger = ({ value, placeholder, onPress, containerStyle, other = "" }: Props) => {
  return (
    <TouchableOpacity 
      style={[styles.selectInput, containerStyle]} 
      onPress={onPress}
    >
      <Text
        style={[
          styles.selectText,
          !value && styles.selectTextPlaceholder,
        ]}
      >
        {value ? `${value}${other}` : placeholder}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#666" />
    </TouchableOpacity>
  );
};