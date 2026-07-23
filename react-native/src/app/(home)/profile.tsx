import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router'; // 💡 リフレッシュ検知用にuseLocalSearchParamsを追加
import UserProfileCard from '@/components/homeProfileCards';
import { screanStyles } from '@/styles/homeProfileStyles';
import { ProfileDoc, preferences } from '@/types/firebaseDoc';
import { getLatestData } from '@/dao/firebaseGet';
import { getPreferencesByVersion } from '@/dao/firebaseGetPreferences'; // 💡 先ほど作成したDAO関数をインポート

// パラメーター用の仮データ
const dummyStatus = {
  speed: 0.8,
  math: 0.9,
  flexibility: 0.6,
  serious: 0.7,
  footSize: 0.5,
};

// preferencesの初期値 / フォールバック用データ
const defaultPreferences: preferences = {
  uid: 'test3',
  movie: '未設定',
  likedFood: '未設定',
  hobby: '未設定',
  skill: '未設定',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileDoc | null>(null);
  // 💡 取得したpreferencesを管理するStateを追加
  const [prefs, setPrefs] = useState<preferences | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // editProfileからrouter.replaceで戻ってきた際のリロード用パラメータを監視
  const localParams = useLocalSearchParams<{ refresh?: string }>();

  const TARGET_UID = 'test3'; // テスト用のUID

  useEffect(() => {
    const fetchProfileAndPreferences = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. user-metaコレクションから最新のprofileを取得する
        const profileData = await getLatestData(TARGET_UID);
        
        if (profileData) {
          setProfile(profileData);

          // 2. 💡 取得した最新のversionを利用して、preferencesコレクションからデータを取得する
          const prefData = await getPreferencesByVersion(TARGET_UID, profileData.version);
          if (prefData) {
            setPrefs(prefData);
          } else {
            // preferencesが存在しない場合は初期のガワをセット
            setPrefs({
              ...defaultPreferences,
              uid: TARGET_UID,
            });
          }
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

    fetchProfileAndPreferences();
  }, [localParams.refresh]); // 💡 保存されて戻ってきた際に再読み込みが走るようトリガーに指定

  // 変更ボタンが押された時に、取得したデータを第2引数にのせて遷移する
  const handleEditNavigate = () => {
    if (!profile) return;

    // 現在の状態（取得できた実データ、なければデフォルト値）
    const currentPrefs = prefs || defaultPreferences;

    router.push({
      pathname: '/editProfile',
      params: {
        uid: profile.uid,
        userName: profile.userName ?? '',
        connectAdd: profile.connectAdd ?? '',
        birthday: profile.birthday ? profile.birthday.toISOString() : '', // Date型はシリアライズ用に文字列変換
        iconImagePath: profile.iconImagePath ?? '',
        bio: profile.bio ?? '',
        createdAt: profile.createdAt instanceof Date ? profile.createdAt.toISOString() : '',
        version: String(profile.version),
        // 💡 ダミーではなく、実際にFirebaseから持ってきた値を次の画面へ引き渡す
        movie: currentPrefs.movie ?? '',
        likedFood: currentPrefs.likedFood ?? '',
        hobby: currentPrefs.hobby ?? '',
        skill: currentPrefs.skill ?? '',
      },
    });
  };

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
    <ScrollView contentContainerStyle={screanStyles.container} scrollEnabled={false}>
      <UserProfileCard 
        profile={profile} 
        preferences={prefs || defaultPreferences} // 💡 取得した実データをPropsでコンポーネントに渡す
        status={dummyStatus}
        onEditPress={handleEditNavigate} 
      />
    </ScrollView>
  );
}