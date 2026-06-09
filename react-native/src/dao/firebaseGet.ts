import { db } from './firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { ProfileData } from '@/atoms/profileAtom';

/**
 * Firestoreから指定されたバージョンのユーザープロフィール情報を取得する。
 * @param uid - 取得対象ユーザーのUID
 * @param version - 取得したいプロフィールのバージョン番号
 * @returns 取得したプロフィールデータ。ドキュメントが存在しない場合は null を返す。
 */
const getUserProfile = async (uid: string, version: number): Promise<ProfileData | null> => {

  try {
    const profileDocRef = doc(db, 'profile', `${uid}-${version}`);
    const docSnap = await getDoc(profileDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('[DAO] Firestoreからデータ取得成功:', data);

      // 物理名から論理名への逆マッピング
      return {
        userName: data.userName || '',
        gender: data.gender || '',
        birthday: data.birthday ? data.birthday.toDate() : null,
        iconImagePath: data.iconImagePath || null,
        bio: data.bio || '',
        connectAdd: data.connectAdd || '',
      };
    } else {
      console.log(`[DAO] uid: ${uid} のドキュメントは存在しません`);
      return null;
    }
  } catch (error) {
    console.error('[DAO] Firestoreからのデータ取得に失敗しました:', error);
    throw error;
  }
};

/**
 * Firestoreから指定されたユーザーの最新プロフィール情報を取得する。
 * @param uid - 取得対象ユーザーのUID
 * @returns 取得したプロフィールデータ。ドキュメントが存在しない場合は null を返す。
 */
export const getLatestData = async (uid: string): Promise<ProfileData | null> => {
  try {
    const userMetaDocRef = doc(db, 'user-meta', uid);
    const metaDocSnap = await getDoc(userMetaDocRef);

    if (metaDocSnap.exists()) {
      const metaData = metaDocSnap.data();
      console.log('[DAO] metaデータ取得成功', metaData);

      // プロフィールデータの取得は委任する
      return getUserProfile(uid, metaData.version);
    } else {
      console.log(`[DAO] ${uid} のメタデータは存在しません`)
      return null;
    }
  }
  catch (error) {
    console.error('[DAO] Firestoreからのデータ取得に失敗しました:', error);
    throw error;

  }
}