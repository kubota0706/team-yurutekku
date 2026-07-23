

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
// ★必ず expo-camera がインポートされている
import { CameraView, useCameraPermissions } from 'expo-camera'; 

export const QRScanner = ({ onScanSuccess }: { onScanSuccess: (data: string) => void }) => {
  const [permission, requestPermission] = useCameraPermissions();

  // カメラの権限をチェック・要求する処理
  if (!permission) return <View />;
  if (!permission.granted) {
    // 権限がないときの画面処理...
  }

  // ★ここに「バーコードを読み取った時」の処理が書いてある
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    onScanSuccess(data); // 親（index.tsx）にデータを渡す
  };

  return (
    <View style={styles.container}>
      {/* ★画面にカメラを映し出す本体 */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }
});