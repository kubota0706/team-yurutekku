// import { useNavigation } from '@react-navigation/native';
// import { Alert } from 'react-native';

// export const useQRScanHandler = () => {
//   const navigation = useNavigation<any>();

//   /**
//    * QRコードから読み取ったURLを解析し、ユーザーIDを抜き出す内部関数
//    */
//   const extractUserId = (url: string): string | null => {
//     const prefix = "myapp://profile/";
//     if (url.startsWith(prefix)) {
//       return url.replace(prefix, "").trim();
//     }
//     return null;
//   };

//   /**
//    * スキャン成功時に画面から呼び出されるメイン処理
//    */
//   const handleQRScan = async (scannedData: string) => {
//     // 1. 同じファイル内の関数でURLからユーザーIDを抽出
//     const userId = extractUserId(scannedData);

//     if (!userId) {
//       Alert.alert("エラー", "このQRコードは無効か、対応していない形式です。");
//       return false; // スキャン失敗（再試行へ）
//     }

//     try {
//       // 2. 将来的に、ここで src/dao/ の関数を呼び出してサーバーに交換ログを保存する
//       // await saveExchangeHistory(userId);

//       // 3. 相手のプロフィール画面へナビゲーション（IDをパラメータとして渡す）
//       // ※ 'UserProfile' の部分は、src/navigation/ で定義する実際の画面名に合わせてください
//       navigation.navigate('UserProfile', { userId: userId });
      
//       return true; // スキャン成功
//     } catch (error) {
//       Alert.alert("エラー", "データの処理に失敗しました。");
//       return false;
//     }
//   };

//   return { handleQRScan };
// };

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