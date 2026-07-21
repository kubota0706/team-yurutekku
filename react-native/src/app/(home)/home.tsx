import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

// 💡 Firebase 関連のインポート
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../dao/firebaseConfig'; // 💡 お手元の Firebase 設定ファイルのパスに変更してください

// 💡 アバター表示コンポーネントのインポート
import { AvatarPreview } from '../../components/AvatarPreview'; // 💡 パスを環境に合わせて変更してください

const { width } = Dimensions.get('window');

// ユーザー情報の型定義
interface UserProfile {
  name: string;
  idName?: string;
  avatar?: {
    color: string;
    eye: string;
    brow: string;
    mouth: string;
  };
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // 💡 ログイン中のユーザーID（認証機能やローカル保存値から取得してください）
  const currentUserId = 'USER_ID_HERE'; 

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    // Firestoreの users コレクションからリアルタイムにデータを取得・監視
    const userDocRef = doc(db, 'users', currentUserId);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setUser(data);
        } else {
          // 初期データがない場合
          setUser({
            name: 'ゲスト',
            idName: '@guest',
            avatar: { color: 'blue', eye: 'normal', brow: 'none', mouth: 'normal' },
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firestore 取得エラー:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 画面ヘッダー / アカウント設定など */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="#3F2D20" />
        </TouchableOpacity>
      </View>

      {/* メインカード（ユーザー情報・アバター表示） */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <AvatarPreview
              color={user.avatar.color}
              eye={user.avatar.eye}
              brow={user.avatar.brow}
              mouth={user.avatar.mouth}
            />
          ) : (
            <FontAwesome5 name="user-alt" size={60} color="#fff" />
          )}
        </View>

        {/* ユーザー名・ID */}
        <Text style={styles.userNameText}>{user?.name || '名前未設定'}</Text>
        <Text style={styles.userIdText}>{user?.idName || '@id_name'}</Text>

        {/* アバター編集ボタン */}
        <TouchableOpacity
          style={styles.editAvatarBtn}
          onPress={() => router.push('/Avatar')} // アバター編集画面へのパス
        >
          <Text style={styles.editAvatarBtnText}>アバターを変更</Text>
        </TouchableOpacity>
      </View>

      {/* 下部アクションボタンエリア（QR交換画面などへ遷移） */}
      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.exchangeBtn}
          onPress={() => router.push('/exchange')} // QR交換画面へのパス
        >
          <Ionicons name="qr-code-outline" size={28} color="#fff" style={styles.btnIcon} />
          <Text style={styles.exchangeBtnText}>QRコードで交換</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDE59', // ポップなイエロー背景
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDE59',
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3F2D20',
  },

  /* プロフィールカード */
  profileCard: {
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FFFDF0',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#3F2D20',
    elevation: 4,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: '#3F2D20',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#3F2D20',
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginBottom: 20,
  },
  editAvatarBtn: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editAvatarBtnText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 14,
  },

  /* 下部アクションエリア */
  actionArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  exchangeBtn: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    width: width * 0.8,
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3F2D20',
    elevation: 5,
  },
  btnIcon: {
    marginRight: 10,
  },
  exchangeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});