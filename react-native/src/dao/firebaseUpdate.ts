import { db } from './firebaseConfig'; 
import { doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { ProfileData } from '@/atoms/profileAtom';
import { getLatestData } from '@/dao/firebaseGet'
import { version } from 'react';

/**
 * ユーザープロフィール情報をFirestoreに登録・更新するDAO関数
 * （画像はアップロードせず、渡されたパスをそのまま保存します）
 */
export const insertUserProfile = async (profileData: ProfileData, uid: string): Promise<void> => {
  getLatestData(uid)

  // DateオブジェクトをFirestoreが扱える形式（またはnull）に整理
  const formattedBirthday = profileData.birthday instanceof Date ? profileData.birthday : null;

  // 基本となるデータ構造（物理名とデータ型）
  const baseDocument = {
    userName: profileData.userName ?? '',                 // nullなら空文字
    birthday: formattedBirthday,                          // Date型 または null
    iconImagePath: profileData.iconImagePath ?? '',       
    bio: profileData.bio ?? '',                           // nullなら空文字
    gender: profileData.gender ?? null,                   // null許容
    connectAdd: profileData.connectAdd ?? null,           // null許容
    version: 1,                                           // バージョン (一旦1固定)
    updatedAt: serverTimestamp(),                         // 更新日時は常に最新にする
    createdAt: null,
  };

  try {
    // 最新のバージョンがどこかuser-metaから取得
    const metaDocRef = doc(db, 'user-meta', uid);   // 接続先設定
    const metaDocSnap = await getDoc(metaDocRef);   // 取得
    // データ存在チェック
    if (!metaDocSnap.exists()) throw("メタデータが見つかりません");

    // バージョンというキーで保存されているか、存在チェック
    const metaData = metaDocSnap.data();
    if (!('version' in metaData)) throw("バージョン情報が保存されていません")
    const version = metaData.version;

    // user-metaのバージョン更新用オブジェクト
    const metaBaseDocument = {
      updatedAt: serverTimestamp(),
      version: null
    }

    // 接続先ドキュメント
    const profDoc = `${uid}-${version}`
    // ドキュメントリファレンスを設定
    const profileDocRef = doc(db, 'profile', profDoc);
    // リファレンスを参照しスナップショットを取得
    const profileDocSnap = await getDoc(profileDocRef);
    if (!profileDocSnap.exists()) throw("プロフィールが登録されていません　まず新規登録を行ってください");

    const data = profileDocSnap.data(); // データを取得
    // 作成日時を取得、設定
    baseDocument.createdAt = data?.createdAt;

    // 次のバージョン計算
    const newVersion = version + 1;
    const newProfileDocRef = doc(db, 'profile', `${uid}-${newVersion}`) // 計算したバージョンをドキュメントのキーへ
    // 保存
    await setDoc(newProfileDocRef, baseDocument);

    // user-metaのバージョンを更新
    metaBaseDocument.version = newVersion;
    await setDoc(metaDocRef, metaBaseDocument);

    console.log('[DAO] プロフィールの更新に成功しました')

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