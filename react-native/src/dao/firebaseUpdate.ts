import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/dao/firebaseConfig'; 
import { ProfileDoc, preferences } from '@/types/firebaseDoc';
import { setUserMetaVersion } from '@/dao/firebaseRegister'; //[cite: 5]

/**
 * 指定したバージョンでプロフィールデータを登録・更新する関数
 * @param profileData - 更新するプロフィールデータ
 * @param version - 登録するバージョン番号 (数値型)
 */
export const updateProfileWithVersion = async (profileData: Omit<ProfileDoc, 'createdAt' | 'updatedAt'>, version: number): Promise<void> => {
  if (!profileData.uid) {
    throw new Error('uid が設定されていません。Firestore ドキュメントキーを指定してください。');
  }

  if (version < 1) {
    throw new Error('version は 1 以上の数値を指定してください。');
  }

  // 動的に指定されたバージョンでドキュメント参照を作成 (例: "test3-2")
  const profileDocRef = doc(db, 'profile', `${profileData.uid}-${version}`);

  const profileDocument = {
    uid: profileData.uid,
    userName: profileData.userName ?? '',
    gender: profileData.gender ?? null,
    birthday: profileData.birthday instanceof Date ? profileData.birthday : null,
    iconImagePath: profileData.iconImagePath ?? null,
    bio: profileData.bio ?? null,
    connectAdd: profileData.connectAdd ?? null,
    version: version, 
    createdAt: serverTimestamp(), // 新規バージョンとしてドキュメントを作るため serverTimestamp を適用
    updatedAt: serverTimestamp(),
  };

  try {
    // 指定したドキュメントID（ID-version）でデータを保存
    await setDoc(profileDocRef, profileDocument);
    console.log(`[DAO] profile ドキュメント登録成功 (${profileData.uid}-${version})`);

    // ユーザーのメタデータに最新バージョンを記録する
    await setUserMetaVersion(profileData.uid, version);
    console.log(`[DAO] user-meta のバージョンを ${version} に更新しました`);

  } catch (error) {
    console.error(`[DAO] profile ドキュメント登録(version: ${version})に失敗しました:`, error);
    throw error;
  }
};

/**
 * 💡 指定したバージョンに紐づく preferences サブコレクションを更新する関数
 * @param uid - ユーザーのUID
 * @param version - 新しいバージョン番号
 * @param prefs - 画面から入力された preferences のデータ（uidを除外したもの）
 */
export const updatePreferencesWithVersion = async (
  uid: string,
  version: number,
  prefs: Omit<preferences, 'uid'>
): Promise<void> => {
  const parentDocKey = `${uid}-${version}`;

  // 各固定ドキュメントID（movie, likedFood, hobby, skill）への参照を作成
  const movieRef = doc(db, 'profile', parentDocKey, 'preferences', 'movie');
  const likedFoodRef = doc(db, 'profile', parentDocKey, 'preferences', 'likedFood');
  const hobbyRef = doc(db, 'profile', parentDocKey, 'preferences', 'hobby');
  const skillRef = doc(db, 'profile', parentDocKey, 'preferences', 'skill');

  try {
    // Promise.all を使い、4つのドキュメントに value キーでデータを同時書き込み
    await Promise.all([
      setDoc(movieRef, { value: prefs.movie }),
      setDoc(likedFoodRef, { value: prefs.likedFood }),
      setDoc(hobbyRef, { value: prefs.hobby }),
      setDoc(skillRef, { value: prefs.skill }),
    ]);
    console.log(`[DAO] preferences サブコレクション登録成功 (${parentDocKey})`);
  } catch (error) {
    console.error(`[DAO] preferences サブコレクション登録(version: ${version})に失敗しました:`, error);
    throw error;
  }
};