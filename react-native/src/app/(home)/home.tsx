import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 💡 Firebase 関連
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/dao/firebaseConfig';
import { getAuth } from 'firebase/auth';

// アバター表示用コンポーネント
import { AvatarPreview } from '@/components/AvatarPreview';

// 友達データの型定義（top, left, zIndex を追加）
interface Friend {
  id: string;
  isNew?: boolean;
  avatar: {
    color: string;
    eye: string;
    brow: string;
    mouth: string;
  };
  top?: number;
  left?: string | number;
  zIndex?: number;
}

// 💡 画面確認用デモデータ（ばらけた配置とバランスの良い顔パーツ構成）
const DEMO_FRIENDS: Friend[] = [
  { id: '1', avatar: { color: 'blue', eye: 'sleepy', brow: 'droopy', mouth: 'open' }, top: 20, left: '55%', zIndex: 3 },
  { id: '2', avatar: { color: 'yellow', eye: 'normal', brow: 'one', mouth: 'normal' }, top: 80, left: '10%', zIndex: 2 },
  { id: '3', avatar: { color: 'red', eye: 'smile', brow: 'slanting', mouth: 'smile' }, top: 110, left: '38%', zIndex: 4 },
  { id: '4', avatar: { color: 'Pink', eye: 'smirk', brow: 'problems', mouth: 'lick' }, top: 200, left: '60%', zIndex: 1 },
  { id: '5', avatar: { color: 'green', eye: 'normal', brow: 'one', mouth: 'circle' }, top: 230, left: '18%', zIndex: 2 },
  { id: '6', avatar: { color: 'Purple', eye: 'angry', brow: 'angry', mouth: 'sad' }, top: 310, left: '48%', zIndex: 3 },
  { id: '7', avatar: { color: 'blue', eye: 'slant', brow: 'droopy', mouth: 'open' }, top: 360, left: '8%', zIndex: 1 },
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>(DEMO_FRIENDS);
  const [exchangeCount, setExchangeCount] = useState(DEMO_FRIENDS.length);

  // 💡 現実の時間を取得して「○月」にする
  const currentMonth = `${new Date().getMonth() + 1}月`;

  useEffect(() => {
    // デモデータを初期セット
    setFriends(DEMO_FRIENDS);
    setExchangeCount(DEMO_FRIENDS.length);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log('未ログインのためデモデータを表示します');
      setLoading(false);
      return;
    }

    const myUid = currentUser.uid;
    const friendsRef = collection(db, 'users', myUid, 'friends');

    const unsubscribe = onSnapshot(
  friendsRef,
  (snapshot) => {
    const friendList: Friend[] = [];

    // 💡 index を外側でカウントする
    let index = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.avatar) {
        // Firestore から取得したデータにもばらけさせる座標を自動付与
        const fallback = DEMO_FRIENDS[index % DEMO_FRIENDS.length];
        friendList.push({
          id: doc.id,
          isNew: data.isNew ?? false,
          avatar: data.avatar,
          top: data.top ?? fallback.top,
          left: data.left ?? fallback.left,
          zIndex: data.zIndex ?? fallback.zIndex,
        });
      }
      index++; // インデックスをインクリメント
    });

    if (friendList.length > 0) {
      setFriends(friendList);
      setExchangeCount(friendList.length);
    }

    setLoading(false);
  },
  (error) => {
    console.error('Firestore 受信エラー (デモデータを表示します):', error);
    setLoading(false);
  }
);

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <View>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <Text style={styles.subText}>この月に交換した数 {exchangeCount}人</Text>
        </View>

        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={26} color="#FFC700" />
        </TouchableOpacity>
      </View>

      {/* ノート風背景 & アバター配置 */}
      <View style={styles.notebookContainer}>
        {/* 背景の罫線 */}
        <View style={styles.linesBackground}>
          {[...Array(9)].map((_, i) => (
            <View key={i} style={styles.line} />
          ))}
        </View>

        {/* 💡 アバターをランダム配置するためのスクロールエリア */}
        <ScrollView
          contentContainerStyle={styles.avatarCloudContainer}
          showsVerticalScrollIndicator={false}
        >
          {friends.map((item, index) => {
            const topPos = item.top ?? 20 + index * 60;
            const leftPos = item.left ?? (index % 2 === 0 ? '15%' : '50%');
            const zIndexVal = item.zIndex ?? index;

            return (
              <View
                key={item.id || index}
                style={[
                  styles.avatarWrapper,
                  {
                    top: topPos,
                    left: leftPos as any,
                    zIndex: zIndexVal,
                  },
                ]}
              >
                <AvatarPreview
                  color={item.avatar.color}
                  eye={item.avatar.eye}
                  brow={item.avatar.brow}
                  mouth={item.avatar.mouth}
                  size={120} // ホーム画面用の扱いやすいサイズ
                />

                {item.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* アクションボタン（星・まとめてみる・カート） */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.circleIconButton}>
            <Ionicons name="star" size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryBtn}>
            <Text style={styles.summaryBtnText}>まとめてみる</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleIconButton}>
            <Ionicons name="cart" size={26} color="#FFC700" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EFEA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3EFEA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
  },
  monthText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2C1E11',
  },
  subText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1E11',
    marginTop: 2,
  },
  notificationBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notebookContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  linesBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingVertical: 10,
    zIndex: 0,
  },
  line: {
    height: 1,
    backgroundColor: '#E0DCD7',
    width: '100%',
  },
  avatarCloudContainer: {
    height: 480, // 💡 アバターが散らばる自由領域の高さ
    position: 'relative',
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'absolute', // 💡 top / left で自由に散らばせる
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E7FD54',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    transform: [{ rotate: '12deg' }],
    zIndex: 10,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 2,
  },
  circleIconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#52C7F2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  summaryBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 25,
    elevation: 3,
  },
  summaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});