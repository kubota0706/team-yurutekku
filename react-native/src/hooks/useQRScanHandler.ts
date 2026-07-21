

import { Alert } from 'react-native';

export const useQRScanHandler = () => {
  // URLからIDを抜き出す処理
  const extractUserId = (url: string): string | null => {
    const prefix = "myapp://profile/";
    if (url.startsWith(prefix)) {
      return url.replace(prefix, "").trim();
    }
    return null;
  };

  // スキャン成功時の処理
  const handleQRScan = async (scannedData: string) => {
    const userId = extractUserId(scannedData);

    if (!userId) {
      // アプリ用じゃないQRコード（普通のWebサイトのURLなど）を読んだ場合
      Alert.alert("スキャン結果", `このQRは対応していません:\n${scannedData}`);
      return false; // 再試行できるようにfalseを返す
    }

    // 🎉 成功ポップアップ！
    Alert.alert(
      "スキャン成功！", 
      `解析されたユーザーID:\n✨ ${userId} ✨\n\n（本来ならここでプロフィール画面へ遷移します）`
    );
    return true;
  };

  return { handleQRScan };
};