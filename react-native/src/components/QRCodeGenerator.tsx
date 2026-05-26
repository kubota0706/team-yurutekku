import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

//コンポーネントが受け取るデータの型定義
interface QRCodeGeneratorProps {
    userId: string; //ユーザーID
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ userId }) => {
    // 相手のアプリが読み取ったときに識別できるURL（ディープリンク用）を生成
  　// 例: myapp://profile/user_123
    const qrValue = `myapp://profile/${userId}`;

    return (
        <View style={styles.container}>
          <QRCode
            value={qrValue}             //QRコードに変換する文字例
            size={200}                  //QRコードの大きさ（px）
            backgroundColor="white"     //背景色
            color="black"               //QRコードの色       
        　/>     
        　<Text style={styles.hintText}>このQRコードを相手に読み取らせてください</Text>
    
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  hintText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
  },
});