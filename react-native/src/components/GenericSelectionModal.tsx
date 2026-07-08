/**
 * 入力可能プルダウン
 */

import React, { useState, useMemo } from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, TouchableOpacity, TextInput, FlatList, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { modalStyles as styles } from '@/styles/modalStyles'; // 汎用スタイル

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (item: string) => void;
  data: string[];       // 選択肢のリスト
  title: string;        // モーダルのタイトル
  placeholder: string;  // 検索窓のプレースホルダー
  maxLength?: number;
  keyboardType?: TextInputProps['keyboardType'];
}

export default function GenericSelectionModal({ visible, onClose, onSelect, data, title, placeholder, maxLength, keyboardType }: Props) {
  const [searchText, setSearchText] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => item.includes(searchText));
  }, [searchText, data]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              {/* ヘッダー */}
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} /></TouchableOpacity>
              </View>

              {/* 検索 */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  placeholder={placeholder}
                  value={searchText}
                  onChangeText={setSearchText}
                  maxLength={maxLength}
                  keyboardType={keyboardType}
                />
              </View>

              {/* リスト */}
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.option} onPress={() => { onSelect(item); setSearchText(''); }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}