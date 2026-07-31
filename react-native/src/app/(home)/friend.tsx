import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../dao/firebaseConfig';
import { AvatarPreview } from '../../components/AvatarPreview';
import { useLocalSearchParams } from 'expo-router';

// 友達データの型定義
interface FriendUser {
  uid: string;
  name: string;
  avatar: {
    color: string;
    eye: string;
    brow: string;
    mouth: string;
  };
}

export default function FriendListScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const { uid: paramUid } = useLocalSearchParams<{ uid?: string }>();
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);

  // 💡 Firebaseから友達一覧を取得
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const targetUid = paramUid || currentUser?.uid;

        if (!currentUser) {
          setFriends(DUMMY_FRIENDS);
          setLoading(false);
          return;
        }

        const friendsRef = collection(db, 'uid-version', currentUser.uid, 'friends');
        const querySnapshot = await getDocs(friendsRef);

        const friendList: FriendUser[] = [];
        for (const friendDoc of querySnapshot.docs) {
          const friendUid = friendDoc.id;
          const userDoc = await getDoc(doc(db, 'uid-version', friendUid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            friendList.push({
              uid: friendUid,
              name: data.name || data.nickname || 'ななし',
              // 💡 'Pink' を 'pink' に修正（すべて小文字で統一）
              avatar: data.avatar || { color: 'pink', eye: 'smile', brow: 'none', mouth: 'smile' },
            });
          }
        }

        setFriends(friendList.length > 0 ? friendList : DUMMY_FRIENDS);
      } catch (error) {
        console.error('友達一覧取得エラー:', error);
        setFriends(DUMMY_FRIENDS);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [paramUid]);

  // 💡 検索キーワードで友達を絞り込む
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 💡 友達タップ時にプロフィール画面へ遷移
  const handleSelectFriend = (friend: FriendUser) => {
    router.push({
      pathname: '/profile', // プロフィール画面のパス
      params: { uid: friend.uid, isFriend: 'true' },
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
      {/* ヘッダーエリア（タイトル＆検索バー） */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>友達一覧</Text>
        
        <View style={styles.searchContainer}>
          <AntDesign name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="友達名前検索"
            placeholderTextColor="#A0A0A0"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* 友達リストエリア */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredFriends}
          keyExtractor={(item, index) => item.uid + index}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.friendCard}
              activeOpacity={0.7}
              onPress={() => handleSelectFriend(item)}
            >
              {/* アバター */}
              <View style={styles.avatarWrapper}>
                <AvatarPreview
                  // 💡 .toLowerCase() を挟むことで万が一大文字が入ってきても小文字に変換して表示
                  color={item.avatar.color?.toLowerCase()}
                  eye={item.avatar.eye}
                  brow={item.avatar.brow}
                  mouth={item.avatar.mouth}
                  size={50}
                />
              </View>

              {/* 名前 */}
              <Text style={styles.friendName} numberOfLines={1}>
                {item.name}
              </Text>

              {/* 右矢印アイコン */}
              <FontAwesome name="play" size={18} color="#3B82F6" style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// 💡 テスト用ダミーデータ（大文字を小文字に修正済み）
const DUMMY_FRIENDS: FriendUser[] = [
  {
    uid: '1',
    name: '今川なな代',
    avatar: { color: 'yellow', eye: 'smile', brow: 'one', mouth: 'smile' }
  },
  {
    uid: '2',
    name: '田中たろう',
    avatar: { color: 'blue', eye: 'sleepy', brow: 'droopy', mouth: 'open' }
  },
  {
    uid: '3',
    name: '佐藤はな子',
    avatar: { color: 'red', eye: 'angry', brow: 'angry', mouth: 'sad' }
  },
  {
    uid: '4',
    name: '鈴木けんじ',
    avatar: { color: 'green', eye: 'normal', brow: 'slanting', mouth: 'normal' }
  },
  {
    uid: '5',
    name: '高橋まみ',
    avatar: { color: 'purple', eye: 'smirk', brow: 'problems', mouth: 'lick' } // 💡 'purple' に修正
  },
  {
    uid: '6',
    name: '渡辺たかし',
    avatar: { color: 'pink', eye: 'slant', brow: 'one', mouth: 'circle' }     // 💡 'pink' に修正
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDD48',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDD48',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#332C17',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 44,
    width: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarWrapper: {
    marginRight: 16,
  },
  friendName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  arrowIcon: {
    marginLeft: 10,
  },
});