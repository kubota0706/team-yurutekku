import { atom } from 'jotai';

// 💡 ステップの定義（大文字で統一、マジックナンバー排除）
export type StepType = 'USER_NAME' | 'GENDER' | 'BIRTHDAY' | 'IMAGE' | 'BIO' | 'CONNECT_ADD' | 'CONFIRM';

export type ProfileData = {
  userName: string | null;
  gender: 'male' | 'female' | null;
  birthday: Date | null;
  iconImagePath: string | null; // 💡 追加：画像のURIやベース64
  bio: string | null;    // 💡 追加：自己紹介文
  connectAdd: string | null;
};

// 初期状態
export const profileDataAtom = atom<ProfileData>({
  userName: null,
  gender: null,
  birthday: null,
  iconImagePath: null,
  bio: null,
  connectAdd: null,
});

// 現在のステップ（初期値はNAME）
export const currentStepAtom = atom<StepType>('USER_NAME');