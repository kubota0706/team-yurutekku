import { atom } from 'jotai';
import { ProfileDoc } from '@/types/firebaseDoc';

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
