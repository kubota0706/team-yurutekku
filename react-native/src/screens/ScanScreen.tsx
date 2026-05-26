import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { QRScanner } from '../components/QRScanner';
import { useQRScanHandler } from '../hooks/useQRScanHandler';

export const ScanScreen = () => {
  const { handleQRScan } = useQRScanHandler();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScanSuccess = async (data: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Hooksのロジックを実行
    const success = await handleQRScan(data);
    
    // 失敗した時だけ処理中フラグを解除（成功時は画面遷移するため）
    if (!success) {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <View style={styles.center}><Text>プロフィールを取得中...</Text></View>
      ) : (
        <QRScanner onScanSuccess={handleScanSuccess} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});