import { db } from './firebaseConfig'; 
import { doc, setDoc, serverTimestamp, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { ProfileData } from '@/atoms/profileAtom';

/**
 * ユーザープロフィール情報をFirestoreに登録・更新するDAO関数
 * （画像はアップロードせず、渡されたパスをそのまま保存します）
 */
export const insertUserProfile = async (profileData: ProfileData): Promise<void> => {
  const uid = 'test';

  // DateオブジェクトをFirestoreが扱える形式（またはnull）に整理
  const formattedBirthday = profileData.birthday instanceof Date ? profileData.birthday : null;

  // 基本となるデータ構造（物理名とデータ型）
  const baseDocument = {
    userName: profileData.userName ?? '',                 // nullなら空文字
    birthday: formattedBirthday,                          // Date型 または null
    // 💡 変更点：渡ってきたローカルパス（または既存のURL）をそのまま突っ込む
    iconImagePath: profileData.iconImagePath ?? '',       
    bio: profileData.bio ?? '',                           // nullなら空文字
    gender: profileData.gender ?? null,                   // null許容
    connectAdd: profileData.connectAdd ?? null,           // null許容
    version: 1,                                           // バージョン (一旦1固定)
    updatedAt: serverTimestamp(),                         // 更新日時は常に最新にする
  };

  try {
    const userDocRef = doc(db, 'users', uid);
    // 既存データがあればマージ、なければ新規作成
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        // ----------------------------------------------------
        // 既存データがある場合：バックアップを取ってからアップデート
        // ----------------------------------------------------
        const currentData = userDocSnap.data();

        // uidキー直下のサブコレクション「history」の参照を作成
        const historyDocRef = doc(db, 'users', uid, 'history', String(currentData.version));

        // 引っ張ってきたデータをそのままサブコレクションに突っ込む
        await setDoc(historyDocRef, {
            ...currentData,
            archivedAt: serverTimestamp() // 念のためフィールドとしても時間を残しておくと便利
        });
        console.log('バックアップ成功！');
        
        baseDocument.version = currentData.version + 1;

        // 本番のアップデート処理を実行（createdAtは上書きしない）
        await updateDoc(userDocRef, baseDocument);

    } else {
      // ----------------------------------------------------
      // 新規作成の場合：createdAtを添えて保存
      // ----------------------------------------------------
      console.log('既存のユーザーデータが存在しません（新規作成）');
      
      const newDocument = {
        ...baseDocument,
        createdAt: serverTimestamp(), // 新規作成時のみセット
      };

      await setDoc(userDocRef, newDocument, { merge: true });
    }
    
    console.log(`[DAO] Firestoreへの登録・更新成功 (uid: ${uid})`);
  } catch (error) {
    console.error('[DAO] Firestoreへの書き込みに失敗しました:', error);
    throw error;
  }
};

// 💡 呼び出し元がエラーにならないよう、使わないuploadImageはコメントアウトか削除
/*
export const uploadImage = async (localUri: string): Promise<string> => {
  ...
};
*/