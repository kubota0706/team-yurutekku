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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 💡 Firebase 関連
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/dao/firebaseConfig';
import { getAuth } from 'firebase/auth';

// アバター表示用コンポーネント
import { AvatarPreview } from '@/components/AvatarPreview';

// 友達データの型定義
interface Friend {
  id: string;
  isNew?: boolean;
  avatar: {
    color: string;
    eye: string;
    brow: string;
    mouth: string;
  };
  offsetX?: number;
}

// 💡 画面確認用デモデータ（常に使えるように定義）
const DEMO_FRIENDS: Friend[] = [
  { id: '1', isNew: true, avatar: { color: 'yellow', eye: 'sleepy', brow: 'none', mouth: 'normal' }, offsetX: -50 },
  { id: '2', isNew: true, avatar: { color: 'Pink', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: 40 },
  { id: '3', isNew: false, avatar: { color: 'red', eye: 'angry', brow: 'none', mouth: 'normal' }, offsetX: -10 },
  { id: '4', isNew: false, avatar: { color: 'blue', eye: 'smile', brow: 'none', mouth: 'normal' }, offsetX: -60 },
  { id: '5', isNew: false, avatar: { color: 'yellow', eye: 'smirk', brow: 'none', mouth: 'normal' }, offsetX: 30 },
  { id: '6', isNew: false, avatar: { color: 'red', eye: 'slant', brow: 'none', mouth: 'normal' }, offsetX: -40 },
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

    // ログインしていない場合でもデモデータを表示したままローディング解除
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
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.avatar) {
            friendList.push({
              id: doc.id,
              isNew: data.isNew ?? false,
              avatar: data.avatar,
            });
          }
        });

        // 💡 Firestore にデータがあれば実データを表示、なければデモデータ表示
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
        <View style={styles.linesBackground}>
          {[...Array(9)].map((_, i) => (
            <View key={i} style={styles.line} />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.avatarCloud} showsVerticalScrollIndicator={false}>
          {friends.map((item, index) => {
            // 画像のようにキュッと密集させるためのマージン計算
            const defaultOffset = index % 2 === 0 ? 30 : -35;
            const marginOffset = item.offsetX ?? defaultOffset;

            return (
              <View
                key={item.id || index}
                style={[
                  styles.avatarWrapper,
                  {
                    marginLeft: marginOffset,
                    // 2番目以降のアバターを上に重ねてギュッとまとめる
                    marginTop: index === 0 ? 10 : -35,
                    zIndex: index,
                  },
                ]}
              >
                <View style={styles.avatarCircle}>
                  <AvatarPreview
                    color={item.avatar.color}
                    eye={item.avatar.eye}
                    brow={item.avatar.brow}
                    mouth={item.avatar.mouth}
                  />
                </View>

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
  avatarCloud: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3.5,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: -6,
    right: -12,
    backgroundColor: '#E7FD54',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 3,
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
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: 'bold',
  },
  activeTabLabel: {
    color: '#000',
  },
});