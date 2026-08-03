import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const flipIcon = require('@/assets/camera/cameraswitch.png');       // 右下: カメラ切り替え
const backIcon = require('@/assets/camera/back.png');               // 画面2: 戻る
const downloadIcon = require('@/assets/camera/save.png');           // 画面2: ダウンロード
const friendIcon = require('@/assets/camera/choicebutton.png');     // 画面2: 友達選択

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [photoUri, setPhotoUri] = useState<string | null>(null); // 撮影した写真のURI
  const cameraRef = useRef<any>(null);

  // パーミッション確認中
  if (!permission) return <View style={styles.container} />;

  // カメラ権限がない場合の表示
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>カメラへのアクセス許可が必要です</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>許可する</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📸 写真撮影処理
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.8, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setPhotoUri(data.uri); // 撮影した写真をセットして2枚目のプレビュー画面へ切り替え
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 上部タブ (撮影 / ログ) */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>撮影</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>ログ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* メインビュー */}
      <View style={styles.previewContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
        )}
      </View>

      {/* 下部操作バー */}
      <View style={styles.bottomBar}>
        {photoUri ? (
          // ---------------- 画面2 (プレビュー画面) ----------------
          <View style={styles.actionRow}>
            {/* 左：戻る */}
            <View style={styles.iconBtnContainer}>
              <TouchableOpacity onPress={() => setPhotoUri(null)}>
                <Image source={backIcon} style={styles.actionIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>

            {/* 中央：ダウンロード */}
            <View style={styles.downloadBtnContainer}>
              <TouchableOpacity onPress={() => console.log('保存')}>
                <Image source={downloadIcon} style={styles.downloadIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>

            {/* 右：友達選択 */}
            <View style={styles.friendBtnContainer}>
              <TouchableOpacity onPress={() => console.log('友達選択へ')}>
                <Image source={friendIcon} style={styles.friendIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // ---------------- 画面1 (撮影画面) ----------------
          <View style={styles.actionRow}>
            {/* 左：ホームに戻る */}
            <View style={styles.homeBtnContainer}>
              <TouchableOpacity style={styles.homeBtn} onPress={() => console.log('ホームに戻る')}>
                <Text style={styles.homeBtnText}>◀</Text>
              </TouchableOpacity>
            </View>

            {/* 中央：シャッター */}
            <View style={styles.shutterBtnContainer}>
              <TouchableOpacity style={styles.shutterBtn} onPress={takePicture}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>
            </View>

            {/* 右：カメラ切替 */}
            <View style={styles.flipBtnContainer}>
              <TouchableOpacity 
                onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
              >
                <Image source={flipIcon} style={styles.flipIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  permissionBtn: {
    backgroundColor: '#3B97FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 3,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 17,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  activeTabText: {
    fontWeight: '900',
    color: '#000000',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#666666',
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },

  bottomBar: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },

  // ---------------- 画面1用スタイル ----------------
  homeBtnContainer: {
    flex: 1,                          // 💡 幅を1/3に均等分割
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtn: {
    width: 60,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4299FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#4299FF',
    fontSize: 18,
  },
  shutterBtnContainer: {
    flex: 1,                          // 💡 幅を1/3に均等分割
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
  },
  flipBtnContainer: {
    flex: 1,                          // 💡 幅を1/3に均等分割
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipIcon: {
    width: 44,
    height: 44,
  },

  // ---------------- 画面2用スタイル ----------------
  iconBtnContainer: {
    flex: 1,                          // 💡 幅を1/3に均等分割
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 36,
    height: 36,
  },
  downloadBtnContainer: {
    flex: 1,                          // 💡 幅を1/3に均等分割
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadIcon: {
    width: 64,
    height: 64,
  },
  friendBtnContainer: {
    flex: 1,                          // 💡 幅を1/3に均等分割
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendIcon: {
    width: 100,
    height: 44,
  },
});