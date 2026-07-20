// ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text } from 'react-native';
import UserProfileCard from '@/components/homeProfileCards';
import { screanStyles } from '@/styles/homeProfileStyles';
import { ProfileDoc, preferences } from '@/types/firebaseDoc';
import { getLatestData } from '@/dao/firebaseGet';

// パラメーター用の仮データ
const dummyStatus = {
  speed: 0.8,
  math: 0.9,
  flexibility: 0.6,
  serious: 0.7,
  footSize: 0.5,
};

// preferencesの仮データ（今回はProfileDocの取得のみ実データ化するため、Preferencesは一旦仮データとして残します）
const dummyPreferences: preferences = {
  uid: 'test3',
  movie: '大阪',
  likedFood: 'ラーメン',
  hobby: 'カフェ巡り',
  skill: '散歩',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileDoc | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const TARGET_UID = 'test3'; // テスト用のUID

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // user-metaコレクションからversionを取得し、対応する最新のprofileを内部で取得する
        const data = await getLatestData(TARGET_UID);
        
        if (data) {
          setProfile(data);
        } else {
          setError('プロフィールデータが見つかりませんでした。');
        }
      } catch (err) {
        console.error(err);
        setError('データの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // ローディング中の表示
  if (isLoading) {
    return (
      <View style={[screanStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // エラー発生時の表示
  if (error || !profile) {
    return (
      <View style={[screanStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>{error || 'データがありません'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={screanStyles.container}>
      <UserProfileCard 
        profile={profile} 
        preferences={dummyPreferences} 
        status={dummyStatus}
      />
    </ScrollView>
  );
}