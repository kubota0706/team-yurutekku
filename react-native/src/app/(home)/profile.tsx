// ProfileScreen.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import UserProfileCard from '@/components/homeProfileCards';
import { screanStyles } from '@/styles/homeProfileStyles';
import { ProfileDoc, preferences } from '@/types/firebaseDoc';

// Firestoreから取得することを想定した、新しいデータ構造のダミーデータ
const dummyProfileDoc: ProfileDoc = {
  uid: 'user_dummy_123',
  userName: '窪田優也',
  gender: 'female',
  birthday: new Date('2005-07-17'),
  iconImagePath: 'https://firebasestorage.googleapis.com/v0/b/yurutekku.firebasestorage.app/o/user_avatars%2Favatar_1780966591181_npzvfi.jpg?alt=media&token=215135a9-6734-4fe3-9e2e-a73dacb8ba92',
  bio: null, // ここをnullにしておくと、UserProfileCard側で項目別のフォールバックテキストが表示されます
  connectAdd: '0123-456-789', // ニックネームの代わりにconnectAddを使用する例
  createdAt: new Date(),
  updatedAt: new Date(),
  version: 1,
};

const dummyPreferences: preferences = {
  uid: 'user_dummy_123',
  movie: '大阪',    // 行きたい場所のキーがmovieになってしまってるのは後で修正します
  likedFood: 'ラーメン',
  hobby: 'カフェ巡り',
  skill: '散歩',
};

// パラメーター用の仮データ
const dummyStatus = {
  speed: 0.8,
  math: 0.9,
  flexibility: 0.6,
  serious: 0.7,
  footSize: 0.5,
};

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={screanStyles.container}>
      <UserProfileCard 
        profile={dummyProfileDoc} 
        preferences={dummyPreferences} 
        status={dummyStatus}
      />
    </ScrollView>
  );
}