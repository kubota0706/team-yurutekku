import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// 💡 Firebase 関連
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/dao/firebaseConfig';

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

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [exchangeCount, setExchangeCount] = useState(0);

  const currentMonth = '6月';

  useEffect(() => {
    // 💡 データベースから友達一覧を取得
    const q = query(collection(db, 'uid-version'));

    const unsubscribe = onSnapshot(
      q,
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

        // 取得データがない場合のダミー表示（確認用）
        if (friendList.length === 0) {
          setFriends([
            { id: '1', isNew: true, avatar: { color: 'blue', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: 40 },
            { id: '2', isNew: true, avatar: { color: 'yellow', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: -50 },
            { id: '3', isNew: false, avatar: { color: 'red', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: 0 },
            { id: '4', isNew: false, avatar: { color: 'blue', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: -40 },
            { id: '5', isNew: false, avatar: { color: 'yellow', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: 30 },
            { id: '6', isNew: false, avatar: { color: 'red', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: -60 },
            { id: '7', isNew: true, avatar: { color: 'green', eye: 'normal', brow: 'none', mouth: 'normal' }, offsetX: 10 },
          ]);
          setExchangeCount(6);
        } else {
          setFriends(friendList);
          setExchangeCount(friendList.length);
        }

        setLoading(false);
      },
      (error) => {
        console.error('Firestore 受信エラー:', error);
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
          {[...Array(8)].map((_, i) => (
            <View key={i} style={styles.line} />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.avatarCloud}>
          {friends.map((item, index) => {
            const marginOffset = item.offsetX ?? (index % 2 === 0 ? 30 : -30);

            return (
              <View
                key={item.id || index}
                style={[
                  styles.avatarWrapper,
                  { marginLeft: marginOffset, marginTop: index === 0 ? 0 : -25 },
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

      {/* ボトムナビゲーション */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={26} color="#000" />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>ホーム</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/memory' as any)}>
          <Ionicons name="camera-outline" size={26} color="#8E8E93" />
          <Text style={styles.tabLabel}>おもいで</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/friends' as any)}>
          <Ionicons name="people-outline" size={26} color="#8E8E93" />
          <Text style={styles.tabLabel}>ともだち</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/exchange')}>
          <Ionicons name="qr-code-outline" size={26} color="#8E8E93" />
          <Text style={styles.tabLabel}>こうかん</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/Avatar')}>
          <MaterialCommunityIcons name="account-details-outline" size={26} color="#8E8E93" />
          <Text style={styles.tabLabel}>プロフィール</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0DCD7',
  },
  monthText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#3F2D20',
  },
  subText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3F2D20',
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
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    zIndex: 0,
  },
  line: {
    height: 1,
    backgroundColor: '#E0DCD7',
    width: '100%',
  },
  avatarCloud: {
    alignItems: 'center',
    paddingVertical: 30,
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginVertical: 4,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#E7FD54',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    transform: [{ rotate: '12deg' }],
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
    paddingBottom: 20,
    zIndex: 2,
  },
  circleIconButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
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