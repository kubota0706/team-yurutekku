// import { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// interface QRScannerProps {
//   // スキャン成功時に、読み取った文字列（URL）を親画面に渡すための関数
//   onScanSuccess: (data: string) => void;
// }

// export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
//   // expo-cameraが提供する、カメラ権限を管理するHook
//   const [permission, requestPermission] = useCameraPermissions();
//   // 連続で何度もスキャンしてしまうのを防ぐためのロックフラグ
//   const [scanned, setScanned] = useState(false);

//   // 1. 権限の確認中
//   if (!permission) {
//     return <View style={styles.center}><Text>読み込み中...</Text></View>;
//   }

//   // 2. ユーザーがカメラを許可していない場合、許可を求める画面を表示
//   if (!permission.granted) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.text}>QRコードを読み取るにはカメラの許可が必要です</Text>
//         <Button onPress={requestPermission} title="カメラの利用を許可する" />
//       </View>
//     );
//   }

//   // QRコードを検知したときに実行される関数
//   const handleBarcodeScanned = ({ data }: { data: string }) => {
//     if (scanned) return; // すでにスキャン処理中なら何もしない
//     setScanned(true);    // ロックをかける
    
//     // 親コンポーネントに読み取ったデータを渡す
//     onScanSuccess(data);
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={StyleSheet.absoluteFill}
//         barcodeScannerSettings={{
//           barcodeTypes: ['qr'], // QRコードのみをターゲットにする（高速化）
//         }}
//         onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
//       />
      
//       {/* スキャン完了後に再試行するための簡易ボタン（デバッグ・UI用） */}
//       {scanned && (
//         <View style={styles.scanAgainButton}>
//           <Button title="もう一度スキャンする" onPress={() => setScanned(false)} />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   text: {
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   scanAgainButton: {
//     position: 'absolute',
//     bottom: 50,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     borderRadius: 10,
//     padding: 10,
//   }
// });

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