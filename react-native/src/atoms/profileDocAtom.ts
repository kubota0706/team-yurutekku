import { atom } from 'jotai';
import { ProfileDoc } from '@/types/firebaseDoc';
import { preferences } from '@/types/firebaseDoc';

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

export const preferencesAtom = atom<preferences>({
    uid: '',
    movie: null,
    likedFood: null,
    hobby1: null,
    hobby2: null,
    skill: null,
})