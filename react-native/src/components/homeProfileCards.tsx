// UserProfileCard.tsx
import React from 'react';
import { Text, View, Image } from 'react-native';
import Svg, { Polygon, Line, Circle } from 'react-native-svg';
import { baseStyles as styles } from '@/styles/homeProfileStyles';
import { ProfileDoc, preferences } from '@/types/firebaseDoc'; // 定義場所に合わせてパスを調整してください
import { ActionButtons } from './ActionButtons';
import { router } from 'expo-router';

// コンポーネントが受け取るPropsの定義
interface UserProfileCardProps {
  profile: ProfileDoc;
  preferences: preferences;
  // パラメーターはドキュメントにないため、拡張用、またはbio等からパースする想定の仮定義
  status?: {
    speed: number;
    math: number;
    flexibility: number;
    serious: number;
    footSize: number;
  };
}

export default function UserProfileCard({ profile, preferences, status }: UserProfileCardProps) {
  // Dateオブジェクトを「YYYY.MM.DD」の形式に変換するヘルパー
  const formatDate = (date: Date | null) => {
    if (!date) return '----.--.--';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };

  // デフォルトのステータス値（データがない場合のフォールバック）
  const chartStatus = status || {
    speed: 0.5,
    math: 0.5,
    flexibility: 0.5,
    serious: 0.5,
    footSize: 0.5,
  };

  // レーダーチャートの描画計算用設定
  const center = 70;
  const radius = 55;
  const angles = [-Math.PI / 2, -Math.PI / 10, Math.PI * 3 / 10, Math.PI * 7 / 10, Math.PI * 11 / 10];

  // ステータス値からSVGの座標文字列を生成
  const getPointsString = (stats: NonNullable<typeof status>) => {
    const values = [stats.speed, stats.math, stats.flexibility, stats.serious, stats.footSize];
    return values.map((val, i) => {
      const r = radius * val;
      const x = center + r * Math.cos(angles[i]);
      const y = center + r * Math.sin(angles[i]);
      return `${x},${y}`;
    }).join(' ');
  };

  // 背景のグリッド五角形の座標生成
  const getGridPoints = (scale: number) => {
    return angles.map((angle) => {
      const x = center + (radius * scale) * Math.cos(angle);
      const y = center + (radius * scale) * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const handleNext = () => {
    router.push('/')
  }

  return (
    <View style={styles.card}>
      {/* タイトル */}
      <Text style={styles.title}>MY PROFILE</Text>

      {/* 上部：アバターと基本情報 */}
      <View style={styles.topSection}>
        <View style={styles.avatarContainer}>
          {profile.iconImagePath ? (
            <Image source={{ uri: profile.iconImagePath }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
          )}
        </View>

        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>なまえ</Text>
            <Text style={styles.infoValue}>{profile.userName || '未設定'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>連絡先</Text>
            <Text style={styles.infoValue}>{profile.connectAdd || '未設定'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>生年月日</Text>
            <Text style={styles.infoValue}>{formatDate(profile.birthday)}</Text>
          </View>
        </View>
      </View>

      {/* 中部：紹介文文章 */}
      <View style={styles.bioSection}>
        {/* bio全体をそのまま出す形にするか、プロパティを割り当てるか、DB設計に応じて調整してください */}
        {profile.bio ? (
          <Text style={styles.bioText}>{profile.bio}</Text>
        ) : (
          <>
            <Text style={styles.bioText}>
              わたしの行きたい場所は <Text style={styles.highlightText}>{preferences.movie || '未設定'}</Text> ！
            </Text>
            <Text style={styles.bioText}>
              特技は <Text style={styles.highlightText}>{preferences.skill || '未設定'}</Text> だよ！
            </Text>
            <Text style={styles.bioText}>
              しゅみは <Text style={styles.highlightText}>{preferences.hobby || '未設定'}</Text> なんだ〜♪
            </Text>
            <Text style={styles.bioText}>
              おすすめの映画は <Text style={styles.highlightText}>{preferences.movie || '未設定'}</Text> ！
            </Text>
          </>
        )}
      </View>

      {/* 下部：自分パラメーター */}
      <View style={styles.parameterSection}>
        <View style={styles.parameterLeft}>
          <Text style={styles.parameterTitle}>自分パラメーター</Text>
          <Text style={styles.paramItem}>● 足の速さ</Text>
          <Text style={styles.paramItem}>★ さんすう</Text>
          <Text style={styles.paramItem}>▲ 前屈</Text>
          <Text style={styles.paramItem}>■ まじめ</Text>
          <Text style={styles.paramItem}>★ 足の大きさ</Text>
        </View>

        {/* 右側：レーダーチャート */}
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
              points={getPointsString(chartStatus)}
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
        nextLabel='変更'
        onNext={handleNext}
      />
      
    </View>
  );
}