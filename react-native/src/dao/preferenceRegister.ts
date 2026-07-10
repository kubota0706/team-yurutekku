import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { preferences } from '@/types/firebaseDoc';

const preferenceFields: Array<Exclude<keyof preferences, 'uid'>> = [
  'movie',
  'likedFood',
  'hobby',

  'skill',
];

export const saveUserPreferences = async (
  uid: string,
  version: number,
  preferenceData: preferences,
): Promise<void> => {
  if (!uid) {
    throw new Error('uid が必要です。');
  }

  const profileDocRef = doc(db, 'profile', `${uid}-${version}`);
  const preferencesCollectionRef = collection(profileDocRef, 'preferences');

  try {
    const savePromises = preferenceFields.map((field) => {
      const fieldValue = preferenceData[field] ?? null;
      return setDoc(doc(preferencesCollectionRef, field), {
        type: field,
        value: fieldValue,
        updatedAt: serverTimestamp(),
      });
    });

    await Promise.all(savePromises);
    console.log(`[DAO] preferences 保存完了: ${uid}-${version}`);
  } catch (error) {
    console.error('[DAO] preferences 保存に失敗しました:', error);
    throw error;
  }
};
