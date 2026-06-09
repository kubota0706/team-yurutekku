// 💡 同じフォルダ（同階層）にある firebaseConfig から db を読み込む
import { db } from './firebaseConfig'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProfileData } from '@/atoms/profileAtom';

/**
 * ユーザープロフィール情報をFirestoreに登録するDAO関数
 * @param profileData Jotaiのフォームデータ
 */
export const insertUserProfile = async (profileData: ProfileData): Promise<void> => {
  // テスト用固定UID
  const uid = 'test';

  // 物理名とデータ型の設計に100%合わせたオブジェクト構造
  const userDocument = {
    userName: profileData.userName,                     // ユーザー名 (必須)
    birthday: profileData.birthday,                     // 生年月日 (必須)
    iconImagePath: profileData.iconImagePath,           // アイコン画像パス (必須)
    bio: profileData.bio,                               // 自己紹介文 (必須)
    gender: profileData.gender,                         // 性別 (必須)
    connectAdd: profileData.connectAdd,
    version: 1,                                         // バージョン (初回の登録のため1を指定)
    createdAt: serverTimestamp(),                       // サーバー側で刻む正確な作成日時
    updatedAt: serverTimestamp(),                       // サーバー側で刻む正確な更新日時
  };

  const userMetaDocument = {
    version: userDocument.version,
    updatedAt: serverTimestamp(),
  }

  try {
    // usersコレクションの 'test' ドキュメントに対してデータを書き込み（既存があればマージ）
    const userDocRef = doc(db, 'profile', `${uid}-${userDocument.version}`);
    const userMetaDocRef = doc(db, 'user-meta', uid)
    await setDoc(userDocRef, userDocument, { merge: true });
    await setDoc(userMetaDocRef, userMetaDocument, {merge: true} )
    console.log(`[DAO] Firestoreへの登録成功 (uid: ${uid})`);
  } catch (error) {
    console.error('[DAO] Firestoreへの書き込みに失敗しました:', error);
    throw error;
  }
};

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