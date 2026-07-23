import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';
import { router } from 'expo-router';
import { AvatarPreview } from '../../components/AvatarPreview';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { db } from '@/dao/firebaseConfig';

 // パスは環境に合わせて調整してください

const { width } = Dimensions.get('window');

// 読み取ったユーザーデータの型定義
interface ScannedUser {
  id?: string;
  name: string;
  avatar: {
    color: string;
    eye: string;
    brow: string;
    mouth: string;
  };
}

export default function ExchangeScreen() {
  // 画面モード: 'scan' (読み取り) | 'myCode' (自分のQR)
  const [mode, setMode] = useState<'scan' | 'myCode'>('scan');

  // expo-camera の権限Hook
  const [permission, requestPermission] = useCameraPermissions();
  // 連続読み取り防止用のフラグ
  const [scanned, setScanned] = useState(false);

  // カウントダウンタイマー（自分のQRコード画面用: 5分 = 300秒）
  const [timeLeft, setTimeLeft] = useState(300);

  // 追加確認モーダルの状態
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);

  // 5分カウントダウン処理
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (mode === 'myCode' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, timeLeft]);

  // 秒数を mm:ss フォーマットにする関数
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // QRコード読み取り時の処理
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true); // 連続スキャン防止用のロック

    try {
      // 💡 QRコード内のデータをパース（JSON文字列の場合）
      // 例: {"id": "123", "name": "今川なな代", "avatar": {...}}
      const parsedData = JSON.parse(data) as ScannedUser;
      setScannedUser(parsedData);
    } catch {
      // JSONでない単なる文字列/URLだった場合のフォールバック（デバッグ・ダミー用）
      setScannedUser({
        name: '今川なな代',
        avatar: { color: 'blue', eye: 'normal', brow: 'none', mouth: 'normal' },
      });
    }

    setIsAdded(false);
    setModalVisible(true);
  };

  // 友達追加ボタンを押したときの処理
  const handleAddFriend = async () => {
    try {
      // 💡 Firestore等への追加処理を呼び出し

      await addDoc(collection(db, 'friends'), { userId: scannedUser?.id });

      // await addDoc(collection(db, 'friends'), { userId: scannedUser?.id });
 
      
      setIsAdded(true);
    } catch (error) {
      console.error('追加エラー:', error);
      Alert.alert('エラー', '友達の追加に失敗しました');
    }
  };

  // モーダルを閉じる処理
  const handleCloseModal = () => {
    setModalVisible(false);
    setScanned(false); // 次のスキャンができるようにロックを解除
  };

  // 1. カメラ権限の確認中
  if (!permission) return <View style={styles.container} />;

  // 2. カメラの許可が得られていない場合の画面
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="caret-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>QRコードを読み取るにはカメラの許可が必要です</Text>
          <TouchableOpacity style={styles.blueBtn} onPress={requestPermission}>
            <Text style={styles.blueBtnText}>カメラの利用を許可する</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 戻るボタン */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="caret-back" size={24} color="#3B82F6" />
      </TouchableOpacity>

      {/* ================= モード1: 読み取り画面 ================= */}
      {mode === 'scan' ? (
        <View style={styles.scanContainer}>
          {/* カメラのプレビュー表示エリア */}
          <View style={styles.cameraFrameWrapper}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
            {/* イラスト風のスマホ型オーバーレイ枠 */}
            <View style={styles.phoneOverlay} />
          </View>

          {/* 下部切り替えボタン */}
          <TouchableOpacity
            style={styles.bottomSwitchBtn}
            onPress={() => {
              setMode('myCode');
              setTimeLeft(300); // 5分リセット
            }}
          >
            <Text style={styles.bottomSwitchBtnText}>自分のQRコード</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ================= モード2: 自分のQRコード画面 ================= */
        <View style={styles.myCodeContainer}>
          {/* カウントダウン表示 */}
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

          {/* QRコード表示カード */}
          <View style={styles.qrCard}>
            <View style={styles.qrInner}>
              <QRCode
                // 💡 相手に読み取らせたいデータ（JSON文字列など）をセット
                value={JSON.stringify({
                  id: 'my-user-id',
                  name: '自分の名前',
                  avatar: { color: 'red', eye: 'normal', brow: 'none', mouth: 'smile' }
                })}
                size={width * 0.55}
              />
            </View>
          </View>

          {/* 注意書き */}
          <Text style={styles.warningText}>このQRコードは5分間のみ有効です</Text>

          {/* 下部切り替えボタン */}
          <TouchableOpacity
            style={styles.bottomSwitchBtnOutline}
            onPress={() => {
              setMode('scan');
              setScanned(false); // スキャンフラグをリセット
            }}
          >
            <Text style={styles.bottomSwitchBtnOutlineText}>
              QRコードを読み取る
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= モーダル: ユーザー追加画面 ================= */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.addCard}>
            {/* 閉じる (バツ) ボタン */}
            <TouchableOpacity style={styles.closeBadge} onPress={handleCloseModal}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* 上部に飛び出すアバター */}
            <View style={styles.popAvatarWrapper}>
              {scannedUser && (
                <AvatarPreview
                  color={scannedUser.avatar.color}
                  eye={scannedUser.avatar.eye}
                  brow={scannedUser.avatar.brow}
                  mouth={scannedUser.avatar.mouth}
                />
              )}
            </View>

            {/* ユーザー名 */}
            <Text style={styles.userNameText}>
              {scannedUser ? scannedUser.name : ''}
            </Text>

            {/* 追加 / 追加済み ボタン */}
            {isAdded ? (
              <View style={styles.addedBtn}>
                <Text style={styles.addedBtnText}>追加済み</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.addBtn} onPress={handleAddFriend}>
                <Text style={styles.addBtnText}>追加 ►</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDE59',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 60,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  /* 読み取り画面スタイル */
  scanContainer: {
    flex: 1,
    backgroundColor: '#8E8E93',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFrameWrapper: {
    width: width * 0.8,
    height: width * 1.3,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: '#1C1C1E',
    position: 'relative',
  },
  phoneOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  /* 自分のQRコード画面スタイル */
  myCodeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#3F2D20',
    marginBottom: 20,
  },
  qrCard: {
    width: width * 0.75,
    height: width * 0.75,
    backgroundColor: '#FFFDF0',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#FFFDF0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
  },
  qrInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
  },

  /* ボタン */
  bottomSwitchBtn: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    width: '75%',
    borderRadius: 25,
    alignItems: 'center',
    elevation: 4,
  },
  bottomSwitchBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSwitchBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#3B82F6',
    paddingVertical: 14,
    width: '75%',
    borderRadius: 25,
    alignItems: 'center',
  },
  bottomSwitchBtnOutlineText: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* ポップアップ（モーダル）スタイル */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCard: {
    width: width * 0.75,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#000',
    paddingTop: 45,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeBadge: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  popAvatarWrapper: {
    position: 'absolute',
    top: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#3B82F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    marginVertical: 16,
  },
  addBtn: {
    backgroundColor: '#3B82F6',
    width: '85%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addedBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
    width: '85%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addedBtnText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blueBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  blueBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});