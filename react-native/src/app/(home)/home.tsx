import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  name: string;
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

// 💡 ランダム位置を自動生成する関数
const generateRandomPosition = (index: number, totalCount: number) => {
  const minTop = 20;
  const maxTop = 320;
  const minLeft = 5;

  const topStep = (maxTop - minTop) / Math.max(totalCount, 1);
  const randomTop = minTop + topStep * index + (Math.random() * 20 - 10);
  const baseLeft = index % 2 === 0 ? minLeft + Math.random() * 25 : 40 + Math.random() * 25;

  return {
    top: Math.max(minTop, Math.min(maxTop, randomTop)),
    left: `${Math.max(minLeft, Math.min(68, baseLeft))}%`,
    zIndex: Math.floor(Math.random() * 10) + 1,
  };
};

// 💡 デモデータ（自動ランダム計算付き）
const DEMO_FRIENDS: Friend[] = [
  { id: '1', name: '今川なな代', avatar: { color: 'blue', eye: 'sleepy', brow: 'droopy', mouth: 'open' } },
  { id: '2', name: '田中たろう', avatar: { color: 'yellow', eye: 'normal', brow: 'one', mouth: 'normal' } },
  { id: '3', name: '佐藤はな子', avatar: { color: 'red', eye: 'smile', brow: 'slanting', mouth: 'smile' } },
  { id: '4', name: '鈴木けんじ', avatar: { color: 'pink', eye: 'smirk', brow: 'problems', mouth: 'lick' } },
  { id: '5', name: '高橋まみ', avatar: { color: 'green', eye: 'normal', brow: 'one', mouth: 'circle' } },
  { id: '6', name: '渡辺たかし', avatar: { color: 'purple', eye: 'angry', brow: 'angry', mouth: 'sad' } },
].map((item, index, arr) => ({
  ...item,
  ...generateRandomPosition(index, arr.length),
}));

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>(DEMO_FRIENDS);
  const [exchangeCount, setExchangeCount] = useState(DEMO_FRIENDS.length);

  // 💡 選択中の友達（簡易プロフィール用Modalのstate）
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const currentMonth = `${new Date().getMonth() + 1}月`;

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setFriends(DEMO_FRIENDS);
      setExchangeCount(DEMO_FRIENDS.length);
      setLoading(false);
      return;
    }

    const myUid = currentUser.uid;
    const friendsRef = collection(db, 'users', myUid, 'friends');

    const unsubscribe = onSnapshot(
      friendsRef,
      (snapshot) => {
        const friendList: Friend[] = [];
        let index = 0;
        const total = snapshot.docs.length;

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.avatar) {
            const pos = generateRandomPosition(index, total);
            friendList.push({
              id: doc.id,
              name: data.name || data.nickname || 'ななし',
              isNew: data.isNew ?? false,
              avatar: data.avatar,
              top: pos.top,
              left: pos.left,
              zIndex: pos.zIndex,
            });
          }
          index++;
        });

        if (friendList.length > 0) {
          setFriends(friendList);
          setExchangeCount(friendList.length);
        } else {
          setFriends(DEMO_FRIENDS);
        }

        setLoading(false);
      },
      (error) => {
        console.error('Firestore 受信エラー:', error);
        setFriends(DEMO_FRIENDS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 💡 詳細プロフィール画面へ遷移
  const goToFullProfile = () => {
    if (!selectedFriend) return;
    const friendUid = selectedFriend.id;
    setSelectedFriend(null); // モーダルを閉じる
    router.push({
      pathname: '/profile',
      params: { uid: friendUid, isFriend: 'true' },
    });
  };

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

        <ScrollView
          contentContainerStyle={styles.avatarCloudContainer}
          showsVerticalScrollIndicator={false}
        >
          {friends.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              activeOpacity={0.8}
              onPress={() => setSelectedFriend(item)} // 💡 タップで簡易プロフィールを開く
              style={[
                styles.avatarWrapper,
                {
                  top: item.top ?? 20,
                  left: item.left as any,
                  zIndex: item.zIndex ?? index,
                },
              ]}
            >
              <AvatarPreview
                color={item.avatar.color?.toLowerCase()}
                eye={item.avatar.eye}
                brow={item.avatar.brow}
                mouth={item.avatar.mouth}
                size={120}
              />

              {item.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* アクションボタン */}
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

      {/* 💡 簡易プロフィール ポップアップ (Modal) */}
      <Modal
        visible={selectedFriend !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedFriend(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedFriend(null)}
        >
          {selectedFriend && (
            <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
              {/* 閉じるボタン */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedFriend(null)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>

              {/* アバター */}
              <View style={styles.modalAvatarContainer}>
                <AvatarPreview
                  color={selectedFriend.avatar.color?.toLowerCase()}
                  eye={selectedFriend.avatar.eye}
                  brow={selectedFriend.avatar.brow}
                  mouth={selectedFriend.avatar.mouth}
                  size={110}
                />
              </View>

              {/* 名前 */}
              <Text style={styles.modalName}>{selectedFriend.name}</Text>

              {/* 詳細プロフィールボタン */}
              <TouchableOpacity style={styles.detailBtn} onPress={goToFullProfile}>
                <Text style={styles.detailBtnText}>プロフィールを見る</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
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
    height: 440,
    position: 'relative',
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'absolute',
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

  /* 💡 簡易プロフィール (Modal) スタイル */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalAvatarContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
  modalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  detailBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 6,
  },
});