import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useProfileForm } from '@/hooks/useProfileForm';
import { Link } from 'expo-router';
// Firebase Storageを使っている場合
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function DebugProfileScreen() {
  const { profileData, loadProfileFromFirestore } = useProfileForm();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 1. 初回マウント時にFirestoreからデータを読み込む役割
  useEffect(() => {
    loadProfileFromFirestore()
      .catch((err) => console.error('デバッグ取得エラー:', err))
      .finally(() => setLoading(false));
  }, []);

  // 2. profileData が実際に更新されたのを検知して Storage から画像を取りに行く役割（★ここを追加・分離する）
  useEffect(() => {
    const fetchImage = async () => {
      const path = profileData?.iconImagePath;
      if (path) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, path);
          const url = await getDownloadURL(storageRef);
          setImageUrl(url);
        } catch (error) {
          console.error('画像URL取得エラー:', error);
        }
      }
    };

    fetchImage();
  }, [profileData]); // profileDataが変わったら再実行される

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Firestoreから読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐛 Firestore 取得データ</Text>

      {/* 画像の表示 */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.icon} />
      ) : (
        <Text>画像なし</Text>
      )}
      
      <Text style={styles.jsonText}>
        {JSON.stringify(profileData, null, 2)}
      </Text>
      
      <Link href="/" style={styles.link}>
        <Text>戻る</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, paddingTop: 60, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  icon: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  jsonText: { fontFamily: 'monospace', fontSize: 12, backgroundColor: '#eee', padding: 15, borderRadius: 5 },
  link: { marginTop: 20, color: 'blue' }
});