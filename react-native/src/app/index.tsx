import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useRouter } from 'expo-router'; 
import { QRScanner } from '../components/QRScanner'; 

export default function HomeScreen() {
  const router = useRouter(); // 画面遷移のためのルーターを用意

  // QRコードのスキャンに成功したときの処理
  const handleScanSuccess = (data: string) => {
    const prefix = "myapp://profile/";
    
    if (data.startsWith(prefix)) {
      // URLからユーザーIDを抽出 (例: "taro_yamada_99")
      const userId = data.replace(prefix, "").trim();
      
      // 🎉 ここでプロフィール画面へ自動遷移（ジャンプ）させます
      // 例: /profile/taro_yamada_99 というパスに移動
      router.push(`/profile/${userId}`as any);
      
    } else {
      // 違う形式のQRコードを読んだときは警告を出す
      Alert.alert("エラー", "対応外のQRコードです");
    }
  };

  return (
    <View style={styles.container}>
      {/* 必須プロパティにスキャン成功時の関数を渡す */}
      <QRScanner onScanSuccess={handleScanSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});