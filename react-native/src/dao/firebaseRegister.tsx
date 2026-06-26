// 💡 同じフォルダ（同階層）にある firebaseConfig から db を読み込む
import { db } from './firebaseConfig'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProfileDoc } from '@/atoms/profileDocAtom';

export const registerProfileBase = async (profileData: ProfileDoc): Promise<void> => {
  if (!profileData.uid) {
    throw new Error('uid が設定されていません。Firestore ドキュメントキーを指定してください。');
  }

  const profileDocRef = doc(db, 'profile', `${profileData.uid}-1`);
  const profileDocument = {
    uid: profileData.uid,
    userName: profileData.userName ?? '',
    gender: profileData.gender ?? null,
    birthday: profileData.birthday instanceof Date ? profileData.birthday : null,
    iconImagePath: profileData.iconImagePath ?? null,
    bio: profileData.bio ?? null,
    connectAdd: profileData.connectAdd ?? null,
    version: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(profileDocRef, profileDocument);
    console.log(`[DAO] profile ドキュメント登録成功 (${profileData.uid}-1)`);
  } catch (error) {
    console.error('[DAO] profile ドキュメント登録に失敗しました:', error);
    throw error;
  }
}
/**
 * 端末内の画像ファイルをFirebase Storageにアップロードし、公開URLを取得する関数
 * @param localUri ImagePicker等で取得した端末内のローカルパス (file://...)
 * @returns アップロード完了後のFirebase Storageの公開ダウンロードURL (string)
 */
export const uploadImage = async (localUri: string): Promise<string> => {
  try {
    // 1. Firebase Storageのインスタンスを取得（すでにエクスポートされている場合はそれを流用してください）
    const storage = getStorage();

    // 2. 端末のローカルURIから、Blob（バイナリデータ）を生成する
    // ※ React Native環境でファイルをアップロードするための標準的な手法です
    const response = await fetch(localUri);
    const blob = await response.blob();

    // 3. 重複しない一意のファイル名を生成（拡張子を抽出、または一律 .jpg）
    const filename = `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

    // 4. Firebase Storage内の保存先リファレンスを作成（例: user_avatars/xxx.jpg）
    const storageRef = ref(storage, `user_avatars/${filename}`);

    // 5. 💡 データをストレージにアップロード
    console.log('[Firebase] 画像のアップロードを開始します...');
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('[Firebase] アップロードが成功しました。パス:', snapshot.ref.fullPath);

    // 6. 💡 悩まれていたポイント：アップロードしたファイルの「永続URL（ダウンロードURL）」を取得
    const downloadUrl = await getDownloadURL(snapshot.ref);
    
    // 画面（StepAvatar）に返すURL文字列
    return downloadUrl;

  } catch (error) {
    console.error('[Firebase Error] uploadImage内でエラーが発生しました:', error);
    throw error; // 呼び出し元のキャッチブロックへエラーを伝える
  }
};