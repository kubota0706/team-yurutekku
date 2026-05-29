import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useProfileForm } from '@/hooks/useProfileForm';
import { Link, router } from 'expo-router';

export default function DebugProfileScreen() {
  const { profileData, loadProfileFromFirestore } = useProfileForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileFromFirestore()
      .catch((err) => console.error('デバッグ取得エラー:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>Firestoreから読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 30, paddingTop: 60, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        🐛 Firestore 取得データ（生ログ）
      </Text>
      
      <Text style={{ fontFamily: 'monospace', fontSize: 14, backgroundColor: '#eee', padding: 15, borderRadius: 5 }}>
        {JSON.stringify(profileData, null, 2)}
      </Text>
            <Link href="/">
              <Text>戻る</Text>
            </Link>
    </View>
  );
}