import { db } from '../dao/firebaseConfig'; // パスは実際のファイルの場所に合わせてね
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * アバターの組み合わせ（設定データ）をFirestoreに保存する
 * @param userId ユーザーの一意のID
 * @param avatarConfig 選択されたパーツの情報 { hair: 'style_01', eyes: 'type_A', color: 'blue' } など
 */
export const saveAvatarConfig = async (userId: string, avatarConfig: object) => {
  try {
    // users/ユーザーID/ という場所にドキュメントを作成、または上書き
    const userDocRef = doc(db, 'users', userId);
    
    await setDoc(userDocRef, {
      avatarConfig: avatarConfig,
      updatedAt: new Date(),
    }, { merge: true }); // 他の既存データ（名前など）を消さないようにマージ

    console.log('アバターの設定を保存しました！');
  } catch (error) {
    console.error('保存に失敗しました:', error);
  }
};

/**
 * Firestoreからアバターの設定データを読み込む
 * @param userId ユーザーの一意のID
 */
export const loadAvatarConfig = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('保存されていたアバターデータ:', data.avatarConfig);
      return data.avatarConfig; // これを画面のState（状態）にセットしてアバターを復元する
    } else {
      console.log('保存されたデータがありません。');
      return null;
    }
  } catch (error) {
    console.error('読み込みに失敗しました:', error);
    return null;
  }
};