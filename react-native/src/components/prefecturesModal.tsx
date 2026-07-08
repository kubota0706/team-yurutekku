import React, { useState, useMemo } from 'react';
import { Modal, TouchableWithoutFeedback, View, Text, TouchableOpacity, TextInput, FlatList, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PREFECTURES } from '@/constants/prefectures';
import { registerStyles as styles } from '@/styles/profileRegisterBaseStyles';
// 改名したスタイルをインポート
import { prefecturesModalStyles } from '@/styles/profileRegisterBaseStyles';

export default function LocationModal({ 
  visible, 
  onClose, 
  onSelect 
}: { 
  visible: boolean, 
  onClose: () => void, 
  onSelect: (val: string) => void 
}) {
  const [searchText, setSearchText] = useState('');

  // 入力された文字で都道府県をリアルタイムに絞り込み
  const filteredPrefectures = useMemo(() => {
    return PREFECTURES.filter(pref => pref.includes(searchText));
  }, [searchText]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setSearchText(''); // 選択したら検索テキストをクリア
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              
              {/* ヘッダーエリア */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>出身地を選択</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {/* 🔍 検索用入力欄エリア */}
              <View style={prefecturesModalStyles.searchContainer}>
                <View style={prefecturesModalStyles.input}>
                  <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
                  <TextInput
                    style={prefecturesModalStyles.textInput}
                    placeholder="都道府県名を入力（例: 東京）"
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                      <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* 都道府県リスト */}
              <FlatList
                data={filteredPrefectures}
                keyExtractor={(item) => item}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    // 既存のベーススタイルと、今回のカスタムスタイルをマージ
                    style={[styles.prefOption, prefecturesModalStyles.prefOptionCustom]} 
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={{ fontSize: 16, color: '#333' }}>{item}</Text>
                  </TouchableOpacity>
                )}
                // 該当なしの場合のケア
                ListEmptyComponent={
                  <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ color: '#999', fontSize: 14 }}>見つかりませんでした</Text>
                  </View>
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}