import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal, Dimensions, ImageBackground, Alert } from 'react-native'; // 👈 Alert を追加
import { AntDesign } from '@expo/vector-icons';
import { AvatarPreview } from '../components/AvatarPreview';
import { ControlPanel } from '../components/ControlPanel';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'; 
import { db } from '../dao/firebaseConfig';

type ScreenType = 'Start' | 'Customize';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('Start');
  
  // アバターパーツの選択状態 (初期値)
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const [selectedEye, setSelectedEye] = useState<string>('normal');
  const [selectedBrow, setSelectedBrow] = useState<string>('none');
  const [selectedMouth, setSelectedMouth] = useState<string>('normal');

  // モーダル管理
  const [backModalVisible, setBackModalVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);

  // 🛠️ 【追加場所1】Firebaseへ保存する関数をここに追加します
  const saveAvatarToFirebase = async () => {
    try {
      // 💡 テーブル定義のドキュメントID「uid-version」（例: 123abc-1）の形式に合わせます
      // 実際はログイン中のユーザーUIDとアプリのバージョンを結合させて指定してください
      const currentUidVersion = '123abc-1'; 

      if (!currentUidVersion) {
        Alert.alert('エラー', 'ユーザー情報が見つかりません');
        return;
      }

      // コレクション「uid-version」のドキュメントを参照
      const userDocRef = doc(db, 'uid-version', currentUidVersion);

      // テーブル定義に合わせて「avatar」オブジェクトを更新
      await updateDoc(userDocRef, {
        avatar: {
          color: selectedColor,
          eye: selectedEye,
          brow: selectedBrow,
          mouth: selectedMouth,
        },
        // 定義書にある共通フィールド「更新日時」を更新
        updatedAt: serverTimestamp(), 
      });

      Alert.alert('保存完了！', 'データベースにアバター情報を保存しました。');
      setConfirmModalVisible(false); // 保存できたらポップアップを閉じる

    } catch (error) {
      console.error('Firebase保存エラー:', error);
      Alert.alert('エラー', 'データベースへの保存に失敗しました。');
    }
  };

  // 1. スタート画面
  if (currentScreen === 'Start') {
    return (
      <View style={styles.startContainer}>
        <ImageBackground 
          source={require('../assets/avatar/customiz.png')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('Customize')}>
              <Text style={styles.primaryButtonText}>カスタマイズする</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  // 2. カスタマイズ編集画面
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/avatar/bgline.png')} 
        style={styles.previewArea}
        resizeMode="cover"
      >
        <Text style={styles.headerTitle}>カスタマイズ</Text>

        {/* リアルタイム連動プレビュー */}
        <AvatarPreview
          color={selectedColor}
          eye={selectedEye}
          brow={selectedBrow}
          mouth={selectedMouth}
        />

        {/* 戻るボタンと決定ボタンをアバターの下に配置 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => setBackModalVisible(true)}>
            <AntDesign name="arrow-left" size={24} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={() => setConfirmModalVisible(true)}>
            <Text style={styles.submitButtonText}>決定</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* 切り分けたコントロールパネルの呼び出し */}
      <ControlPanel
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedEye={selectedEye}
        setSelectedEye={setSelectedEye}
        selectedBrow={selectedBrow}
        setSelectedBrow={setSelectedBrow}
        selectedMouth={selectedMouth}
        setSelectedMouth={setSelectedMouth}
      />

      {/* --- ポップアップ1: 戻る確認 --- */}
      <Modal visible={backModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>保存せずに戻りますか</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.btnNo]} onPress={() => setBackModalVisible(false)}>
                <Text style={styles.btnNoText}>いいえ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.btnYes]} onPress={() => {
                setBackModalVisible(false);
                setCurrentScreen('Start');
              }}>
                <Text style={styles.btnYesText}>はい</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- ポップアップ2: 決定確認 --- */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.alertBox, { paddingTop: 60 }]}>
            <View style={styles.modalAvatarContainer}>
              <AvatarPreview
                color={selectedColor}
                eye={selectedEye}
                brow={selectedBrow}
                mouth={selectedMouth}
                isModal={true}
              />
            </View>
            <Text style={styles.alertText}>これでいい？</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.btnNo]} onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.btnNoText}>いいえ</Text>
              </TouchableOpacity>
              
              {/* 🛠️ 【追加場所2】「はい」の onPress を変更して作成した関数を呼び出します */}
              <TouchableOpacity style={[styles.modalButton, styles.btnYes]} onPress={saveAvatarToFirebase}>
                <Text style={styles.btnYesText}>はい</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFDD48' },
  startContainer: { flex: 1, backgroundColor: '#FFF01C', justifyContent: 'center', alignItems: 'center' },
  backgroundImage: {flex: 1, width: '100%', height: '100%'},
  buttonContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 140},
  primaryButton: { marginTop: 40, backgroundColor: '#3B82F6', paddingVertical: 14, paddingHorizontal: 48, borderRadius: 30 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  previewArea: { 
    flex: 1.1, 
    width: '100%',
    backgroundColor: '#FFDD48',
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 20, 
    position: 'relative' 
  },
  
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    position: 'absolute',
    top: 40 
  },
  
  buttonRow: {flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', position: 'absolute', bottom: 20, left: 0, right: 0},
  backButton: { backgroundColor: '#fff', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  submitButton: { backgroundColor: '#3B82F6', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { width: width * 0.8, backgroundColor: '#E5E7EB', borderRadius: 24, padding: 24, alignItems: 'center', position: 'relative' },
  alertText: { fontSize: 20, fontWeight: 'bold', color: '#000', marginVertical: 20, textAlign: 'center' },
  modalButtonContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 20, alignItems: 'center', marginHorizontal: 8, borderWidth: 2 },
  btnNo: { backgroundColor: '#fff', borderColor: '#3B82F6' },
  btnNoText: { color: '#3B82F6', fontWeight: 'bold' },
  btnYes: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  btnYesText: { color: '#fff', fontWeight: 'bold' },
  modalAvatarContainer: { position: 'absolute', top: -90, zIndex: 100 },
});