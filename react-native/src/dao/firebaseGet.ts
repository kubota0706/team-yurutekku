import { db } from './firebaseConfig';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { ProfileDoc } from '@/types/firebaseDoc';

/**
 * Firestoreから指定されたバージョンのユーザープロフィール情報を取得する。
 * @param uid - 取得対象ユーザーのUID
 * @param version - 取得したいプロフィールのバージョン番号
 * @returns 取得したプロフィールデータ。ドキュメントが存在しない場合は null を返す。
 */
const getUserProfile = async (uid: string, version: number): Promise<ProfileDoc | null> => {
  try {
    const profileDocRef = doc(db, 'profile', `${uid}-${version}`);
    const docSnap = await getDoc(profileDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as DocumentData;
      console.log('[DAO] Firestoreからデータ取得成功:', data);

      return {
        uid: data.uid || uid,
        userName: data.userName ?? null,
        gender: data.gender ?? null,
        birthday: data.birthday ? data.birthday.toDate() : null,
        iconImagePath: data.iconImagePath ?? null,
        bio: data.bio ?? null,
        connectAdd: data.connectAdd ?? null,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        version: typeof data.version === 'number' ? data.version : version,
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
 * user-meta コレクションの uid ドキュメントから version を読み取り、
 * そのバージョンに紐づく profile ドキュメントを取得します。
 * @param uid - 取得対象ユーザーのUID
 * @returns 取得したプロフィールデータ。ドキュメントが存在しない場合は null を返す。
 */
export const getLatestData = async (uid: string): Promise<ProfileDoc | null> => {
  try {
    const version = await getLatestProfileVersion(uid);
    if (version === null) {
      return null;
    }

    return getUserProfile(uid, version);
  } catch (error) {
    console.error('[DAO] Firestoreからのデータ取得に失敗しました:', error);
    throw error;
  }
};

/**
 * Firestoreの user-meta コレクションから、指定ユーザーの最新バージョンを取得します。
 * @param uid - 取得対象ユーザーのUID
 * @returns バージョン番号。user-metaが存在しない、または version が不正な場合は null。
 */
export const getLatestProfileVersion = async (uid: string): Promise<number | null> => {
  try {
    const userMetaDocRef = doc(db, 'user-meta', uid);
    const metaDocSnap = await getDoc(userMetaDocRef);

    if (!metaDocSnap.exists()) {
      console.log(`[DAO] ${uid} のメタデータは存在しません`);
      return null;
    }

    const metaData = metaDocSnap.data() as DocumentData;
    console.log('[DAO] metaデータ取得成功', metaData);

    const version = typeof metaData.version === 'number' && Number.isInteger(metaData.version)
      ? metaData.version
      : null;

    if (version === null) {
      console.warn(`[DAO] ${uid} の user-meta.version が不正です:`, metaData.version);
      return null;
    }

    return version;
  } catch (error) {
    console.error('[DAO] user-meta から最新バージョンを取得できませんでした:', error);
    throw error;
  }
};