import { atom } from 'jotai';

export type ProfileDoc = {
  uid: string; // Firestoreドキュメントのキーとして必須
  userName: string | null;
  gender: 'male' | 'female' | null;
  birthday: Date | null;
  iconImagePath: string | null;
  bio: string | null;
  connectAdd: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  version: number;
};

export const profileDocAtom = atom<ProfileDoc>({
  uid: '',
  userName: null,
  gender: null,
  birthday: null,
  iconImagePath: null,
  bio: null,
  connectAdd: null,
  createdAt: null,
  updatedAt: null,
  version: 1,
});
