import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Polygon, Line, Circle } from 'react-native-svg';
import { screanStyles, baseStyles as styles } from '@/styles/homeProfileStyles'; 
import { ActionButtons } from '@/components/ActionButtons'; 
import { updateProfileWithVersion, updatePreferencesWithVersion } from '@/dao/firebaseUpdate'; 
import { ProfileDoc } from '@/types/firebaseDoc';

interface EditProfileSearchParams {
  uid: string;
  userName: string;
  connectAdd: string;
  birthday: string;
  iconImagePath: string;
  bio: string;
  version: string;
  movie: string;
  likedFood: string;
  hobby: string;
  skill: string;
  createdAt: string; 
}

const dummyStatus = {
  speed: 0.8,
  math: 0.9,
  flexibility: 0.6,
  serious: 0.7,
  footSize: 0.5,
};

export default function EditProfileScreen() {
  const params = useLocalSearchParams<Record<keyof EditProfileSearchParams, string>>();

  console.log(params);

  // ステート初期値
  const [movie, setMovie] = useState(params.movie || '');
  const [skill, setSkill] = useState(params.skill || '');
  const [hobby, setHobby] = useState(params.hobby || '');
  const [recommendedMovie, setRecommendedMovie] = useState(params.likedFood || '');

  const formatDateString = (isoString: string | undefined) => {
    if (!isoString) return '----.--.--';
    try {
      const date = new Date(isoString);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}.${m}.${d}`;
    } catch {
      return '----.--.--';
    }
  };

  // レーダーチャート計算用
  const center = 70;
  const radius = 55;
  const angles = [-Math.PI / 2, -Math.PI / 10, Math.PI * 3 / 10, Math.PI * 7 / 10, Math.PI * 11 / 10];

  const getPointsString = (stats: typeof dummyStatus) => {
    const values = [stats.speed, stats.math, stats.flexibility, stats.serious, stats.footSize];
    return values.map((val, i) => {
      const r = radius * val;
      const x = center + r * Math.cos(angles[i]);
      const y = center + r * Math.sin(angles[i]);
      return `${x},${y}`;
    }).join(' ');
  };

  const getGridPoints = (scale: number) => {
    return angles.map((angle) => {
      const x = center + (radius * scale) * Math.cos(angle);
      const y = center + (radius * scale) * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const handleSave = async () => {
    try {
      const nextVersion = Number(params.version || 1) + 1;
      
      // paramsからシンプルにオブジェクトを構築
      const profileData: ProfileDoc = {
        uid: params.uid,
        userName: params.userName || '',
        connectAdd: params.connectAdd || '',
        birthday: params.birthday ? new Date(params.birthday) : null,
        iconImagePath: params.iconImagePath || '',
        bio: params.bio || '',
        version: nextVersion,
        gender: null,
        createdAt: params.createdAt ? new Date(params.createdAt) : new Date(),
        updatedAt: new Date(),
      };

      // 1. プロフィールメインの更新
      await updateProfileWithVersion(profileData, nextVersion);

      // 2. preferencesサブコレクションの更新
      await updatePreferencesWithVersion(params.uid, nextVersion, {
        movie: movie,
        likedFood: recommendedMovie,
        hobby: hobby,
        skill: skill,
      });

      router.replace({
        pathname: '/profile',
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      console.error('プロフィールの更新に失敗しました:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={screanStyles.container} scrollEnabled={false}>
      <View style={styles.card}>
        <Text style={styles.title}>EDIT PROFILE</Text>

        <View style={styles.topSection}>
          <View style={styles.avatarContainer}>
            {params.iconImagePath ? (
              <Image source={{ uri: params.iconImagePath }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
            )}
          </View>

          <View style={styles.infoTable}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>なまえ</Text>
              <Text style={styles.infoValue}>{params.userName || '未設定'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>連絡先</Text>
              <Text style={styles.infoValue}>{params.connectAdd || '未設定'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>生年月日</Text>
              <Text style={styles.infoValue}>{formatDateString(params.birthday)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          {params.bio ? (
            <Text style={styles.bioText}>{params.bio}</Text>
          ) : (
            <View style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={styles.bioText}>わたしの行きたい場所は </Text>
                <TextInput
                  style={[styles.highlightText, {
                    borderBottomWidth: 2,
                    borderBottomColor: '#000',
                    minWidth: 90,
                    textAlign: 'center',
                    paddingVertical: 0,
                  }]}
                  value={movie}
                  onChangeText={setMovie}
                  placeholder={params.movie}
                  placeholderTextColor="#777"
                />
                <Text style={styles.bioText}> ！</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={styles.bioText}>特技は </Text>
                <TextInput
                  style={[styles.highlightText, {
                    borderBottomWidth: 2,
                    borderBottomColor: '#000',
                    minWidth: 90,
                    textAlign: 'center',
                    paddingVertical: 0,
                  }]}
                  value={skill}
                  onChangeText={setSkill}
                  placeholder={params.skill}
                  placeholderTextColor="#777"
                />
                <Text style={styles.bioText}> だよ！</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={styles.bioText}>しゅみは </Text>
                <TextInput
                  style={[styles.highlightText, {
                    borderBottomWidth: 2,
                    borderBottomColor: '#000',
                    minWidth: 90,
                    textAlign: 'center',
                    paddingVertical: 0,
                  }]}
                  value={hobby}
                  onChangeText={setHobby}
                  placeholder={params.hobby}
                  placeholderTextColor="#777"
                />
                <Text style={styles.bioText}> なんだ〜♪</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={styles.bioText}>好きな食べ物は </Text>
                <TextInput
                  style={[styles.highlightText, {
                    borderBottomWidth: 2,
                    borderBottomColor: '#000',
                    minWidth: 90,
                    textAlign: 'center',
                    paddingVertical: 0,
                  }]}
                  value={recommendedMovie}
                  onChangeText={setRecommendedMovie}
                  placeholder={params.likedFood}
                  placeholderTextColor="#777"
                />
                <Text style={styles.bioText}> ！</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.parameterSection}>
          <View style={styles.parameterLeft}>
            <Text style={styles.parameterTitle}>自分パラメーター</Text>
            <Text style={styles.paramItem}>● 足の速さ</Text>
            <Text style={styles.paramItem}>★ さんすう</Text>
            <Text style={styles.paramItem}>▲ 前屈</Text>
            <Text style={styles.paramItem}>■ まじめ</Text>
            <Text style={styles.paramItem}>★ 足の大きさ</Text>
          </View>

          <View style={styles.chartContainer}>
            <Svg height="140" width="140">
              <Polygon points={getGridPoints(1.0)} fill="#8a9296" />
              <Polygon points={getGridPoints(0.75)} fill="#9fa7ab" />
              <Polygon points={getGridPoints(0.5)} fill="#b3bcbf" />
              <Polygon points={getGridPoints(0.25)} fill="#ccd5d9" />

              {angles.map((angle, i) => {
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return (
                  <Line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#7a8285" strokeWidth="1" />
                );
              })}

              <Polygon
                points={getPointsString(dummyStatus)}
                fill="rgba(255, 255, 255, 0.2)"
                stroke="black"
                strokeWidth="2"
              />

              {angles.map((angle, i) => (
                <Circle key={i} cx={center + radius * Math.cos(angle)} cy={center + radius * Math.sin(angle)} r="3" fill="#fff" />
              ))}
            </Svg>
          </View>
        </View>

        <ActionButtons
          showBack={true}
          backLabel="戻る"
          onBack={() => router.replace('/profile')}
          nextLabel="保存"
          onNext={handleSave}
        />
      </View>
    </ScrollView>
  );
}