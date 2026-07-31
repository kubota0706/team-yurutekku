import { db } from './firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { preferences } from '@/types/firebaseDoc';

/**
 * 指定した UID とバージョンに紐づく preferences サブコレクションからデータを取得する関数
 * 各ドキュメントID（movie, likedFood, hobby, skill）の "value" フィールドから値を抽出します。
 */
export const getPreferencesByVersion = async (uid: string, version: number): Promise<preferences | null> => {
  if (!uid) {
    throw new Error('uid が指定されていません。');
  }
  if (version < 1) {
    throw new Error('version は 1 以上の数値を指定してください。');
  }

  const parentDocKey = `${uid}-${version}`;

  // 💡 4つの固定ドキュメントIDへの参照を作成
  const movieRef = doc(db, 'profile', parentDocKey, 'preferences', 'movie');
  const likedFoodRef = doc(db, 'profile', parentDocKey, 'preferences', 'likedFood');
  const hobbyRef = doc(db, 'profile', parentDocKey, 'preferences', 'hobby');
  const skillRef = doc(db, 'profile', parentDocKey, 'preferences', 'skill');

  try {
    // 💡 Promise.all を使って 4 つのドキュメントを同時に並列取得（高速化）
    const [movieSnap, likedFoodSnap, hobbySnap, skillSnap] = await Promise.all([
      getDoc(movieRef),
      getDoc(likedFoodRef),
      getDoc(hobbyRef),
      getDoc(skillRef),
    ]);

    // 少なくとも1つのドキュメントが存在すれば、preferences オブジェクトを組み立てる
    const hasData = movieSnap.exists() || likedFoodSnap.exists() || hobbySnap.exists() || skillSnap.exists();

    if (hasData) {
      // 各ドキュメントの "value" フィールドから値を取り出す
      return {
        uid: uid,
        movie: movieSnap.exists() ? (movieSnap.data().value ?? null) : null,
        likedFood: likedFoodSnap.exists() ? (likedFoodSnap.data().value ?? null) : null,
        hobby: hobbySnap.exists() ? (hobbySnap.data().value ?? null) : null,
        skill: skillSnap.exists() ? (skillSnap.data().value ?? null) : null,
      } as preferences;
    } else {
      console.log(`[DAO] preferences サブコレクションにデータが見つかりませんでした (profile/${parentDocKey}/preferences/*)`);
      return null;
    }
  } catch (error) {
    console.error(`[DAO] preferences サブコレクションからの取得に失敗しました (version: ${version}):`, error);
    throw error;
  }
};