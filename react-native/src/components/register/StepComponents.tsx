import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Modal, Keyboard, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/dao/firebaseRegister';

type StepProps<T = any> = {
  value: T;
  onChange: (value: T) => void;
  onNext: () => void;
};

// 1. 名前入力
export function StepName({ value, onChange, onNext }: StepProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>名前を入力してください</Text>
      <TextInput
        style={styles.input}
        placeholder="例：テスト太郎"
        placeholderTextColor="#999"
        value={value || ''} 
        onChangeText={(text) => onChange(text)} 
      />
      <Button title="次へ" onPress={onNext} disabled={!value || value.trim() === ''} />
    </View>
  );
}

// 2. 性別選択
export function StepGender({ value, onChange, onNext }: StepProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>性別を選んでください</Text>
      <Button title="男性" onPress={() => { onChange('male'); onNext(); }} />
      <Button title="女性" onPress={() => { onChange('female'); onNext(); }} />
    </View>
  );
}

// 3. 生年月日入力
export function StepBirthDate({ value, onChange, onNext }: StepProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) onChange(selectedDate);
  };
  const formatDate = (date: Date | null) => {
    if (!date) return 'タップして生年月日を選択';
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  const defaultDate = new Date(2000, 0, 1);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>生年月日を入力してください</Text>
      <TouchableOpacity style={styles.dateSelector} onPress={() => setIsModalVisible(true)}>
        <Text style={[styles.dateText, !value && styles.placeholderText]}>{formatDate(value)}</Text>
      </TouchableOpacity>
      <Button 
        title="次へ" 
        onPress={() => {
          if (!value) onChange(defaultDate);
          onNext();
        }} 
      />
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}><Text style={styles.doneButtonText}>完了</Text></TouchableOpacity>
            </View>
            <DateTimePicker value={value || defaultDate} mode="date" display="spinner" maximumDate={new Date()} locale="ja-JP" onChange={handleDateChange} textColor="#000" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 💡 4. アイコン画像選択（モック用）
export function StepAvatar({ value, onChange, onNext }: StepProps<string | null>) {
  // アップロード中（通信中）に画面をロックしてグルグルを出すための状態
  const [isUploading, setIsUploading] = useState(false);

  const handlePickAndUpload = async () => {
    // 1. 写真ライブラリへのアクセス権限を確認・要求
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('アイコンを設定するには、写真へのアクセス権限が必要です。');
      return;
    }

    // 2. ギャラリーを開いて画像を選択させる
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // 正方形トリミングなどの編集を許可
      aspect: [1, 1],      // アイコン用に1:1の比率を強制
      quality: 0.6,        // アップロード速度向上のため、画質を少し落として軽量化
    });

    // ユーザーが選択をキャンセルしなかった場合
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // 端末内に一時保存されたローカルのパス（例: file://.../image.jpg）
      const localUri = result.assets[0].uri;

      try {
        setIsUploading(true); // グルグル（ローディング）を開始

        // 3. 💡 悩まれていたタイミング：ここでStorageにアップロードして永続URLを取得
        const storageUrl = await uploadImage(localUri);

        // 4. 💡 取得できた本物のパス（URL文字列）をJotaiの状態（iconImagePath）に流し込む
        onChange(storageUrl);

      } catch (error) {
        console.error('画像のアップロードに失敗しました:', error);
        alert('画像のアップロード中にエラーが発生しました。もう一度お試しください。');
      } finally {
        setIsUploading(false); // グルグルを終了
      }
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>アイコン画像を設定してください</Text>
      
      {/* タップすると写真選択〜アップロードが走る丸枠 */}
      <TouchableOpacity 
        style={styles.avatarCircle} 
        onPress={handlePickAndUpload}
        disabled={isUploading} // アップロード中に連打されるのを防ぐ
      >
        {isUploading ? (
          // アップロード中は通信中であることをユーザーに示す
          <ActivityIndicator size="large" color="#007AFF" />
        ) : value ? (
          // 💡 すでにStorageのURL（パス）があるなら、その画像を丸枠いっぱいに表示
          <Image source={{ uri: value }} style={styles.avatarCircle} />
        ) : (
          // まだ画像が未設定の場合の初期表示
          <Text style={styles.placeholderText}>📷 画像を選択 (タップ)</Text>
        )}
      </TouchableOpacity>

      {/* アップロード中、または画像が選択されていない時は「次へ」を押せないようにガード */}
      <Button 
        title="次へ" 
        onPress={onNext} 
        disabled={isUploading || !value} 
      />
    </View>
  );
}

// 💡 5. 自己紹介文入力
export function StepBio({ value, onChange, onNext }: StepProps) {
  return (
    // 💡 画面の「何もないところ」をタップしたときに、キーボードを閉じるイベント（Keyboard.dismiss）を発火させる
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.stepContainer}>
        <Text style={styles.label}>自己紹介文を入力してください</Text>
        
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="趣味や特技など、自由に書いてください"
          placeholderTextColor="#999"
          multiline={true} 
          numberOfLines={4}
          value={value || ''} 
          onChangeText={(text) => onChange(text)} 
        />
        
        <Button title="次へ" onPress={onNext} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export function StepAddres({ value, onChange, onNext }: StepProps) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.label}>連作先を入力してください</Text>
      
      <TextInput
        style={[styles.input, styles.bioInput]}
        placeholder="電話番号や各種SNSのURLなど、自由に記入してください"
        placeholderTextColor="#999"
        multiline={true} 
        numberOfLines={4}
        value={value || ''} 
        onChangeText={(text) => onChange(text)} 
      />
      
      <Button title="次へ" onPress={onNext} />
    </View>
  );
}

// ==========================================
// スタイル
// ==========================================
const styles = StyleSheet.create({
  stepContainer: { gap: 20, alignItems: 'center', width: '100%', paddingHorizontal: 20 },
  label: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  input: {
    width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 15, fontSize: 18, backgroundColor: '#fafafa',
  },
  bioInput: {
    height: 120, paddingVertical: 15, textAlignVertical: 'top', // 複数行テキスト用の調整
  },
  dateSelector: {
    width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    justifyContent: 'center', paddingHorizontal: 15, backgroundColor: '#fafafa', marginBottom: 10,
  },
  dateText: { fontSize: 18, color: '#333', textAlign: 'center' },
  placeholderText: { color: '#999' },
  avatarCircle: {
    width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: '#ccc',
    borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 },
  modalHeader: {
    height: 44, borderBottomWidth: 1, borderBottomColor: '#eee', justifyContent: 'center',
    alignItems: 'flex-end', paddingHorizontal: 20, backgroundColor: '#f9f9f9', borderTopLeftRadius: 20, borderTopRightRadius: 20,
  },
  doneButtonText: { color: '#007AFF', fontSize: 17, fontWeight: '600' },
});