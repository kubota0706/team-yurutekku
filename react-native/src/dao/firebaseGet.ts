import { db } from './firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { ProfileData } from '@/atoms/profileAtom';

/**
 * Firestoreからユーザープロフィール情報を取得するDAO関数
 * @returns 取得したプロフィールデータ、または存在しない場合はnull
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