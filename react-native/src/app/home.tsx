import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, ScrollView, Modal } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { AvatarPreview } from '../components/AvatarPreview'; // 👈 AvatarPreview.tsx の場所に合わせて調整してください
import { db } from '../dao/firebaseConfig'; // Firebaseの設定ファイル
import { collection, getDocs } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

// 交換した友達データの型定義
interface SwappedFriend {
  id: string;
  name: string;
  isNew: boolean;
  avatar: {
    color: string;
    eye: string;
    brow: string;
    mouth: string;
  };
  // 画面にランダムに散らばせるための位置（％と高さ）
  position: {
    left: number;
    top: number;
  };
}

export default function HomeScreen() {
  // 3枚目のプロフィールポップアップの管理状態
  const [selectedFriend, setSelectedFriend] = useState<SwappedFriend | null>(null);
  const [profileVisible, setProfileVisible] = useState<boolean>(false);
  const [exchangedUsers, setExchangedUsers] = useState<any[]>([]);
  const totalExchangeCount = exchangedUsers.length;

  // 🤝 交換した人たちのダミーデータ（人と交換するごとにここへデータが増えていくイメージです）
//   const [friends, setFriends] = useState<SwappedFriend[]>([
//     { id: '1', name: 'ひろき', isNew: true, position: { left: 55, top: 4 }, avatar: { color: 'blue', eye: 'normal', brow: 'none', mouth: 'normal' } },
//     { id: '2', name: 'たかし', isNew: true, position: { left: 15, top: 11 }, avatar: { color: 'yellow', eye: 'normal', brow: 'none', mouth: 'normal' } },
//     { id: '3', name: 'さくら', isNew: false, position: { left: 35, top: 16 }, avatar: { color: 'red', eye: 'normal', brow: 'none', mouth: 'normal' } },
//     { id: '4', name: 'けんた', isNew: false, position: { left: 23, top: 28 }, avatar: { color: 'blue', eye: 'normal', brow: 'none', mouth: 'normal' } },
//     { id: '5', name: 'みく', isNew: false, position: { left: 52, top: 34 }, avatar: { color: 'yellow', eye: 'normal', brow: 'none', mouth: 'normal' } },
//     { id: '6', name: 'ゆうと', isNew: false, position: { left: 12, top: 45 }, avatar: { color: 'red', eye: 'normal', brow: 'none', mouth: 'normal' } },
//     { id: '7', name: 'だいすけ', isNew: true, position: { left: 42, top: 56 }, avatar: { color: 'green', eye: 'normal', brow: 'none', mouth: 'normal' } },
//   ]);

  // 顔タップ時にプロフィールポップアップを開く関数
  const handleOpenProfile = (friend: SwappedFriend) => {
    setSelectedFriend(friend);
    setProfileVisible(true);
  };
  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Firebaseの「friends」コレクション（保存場所）からデータを取得
        const querySnapshot = await getDocs(collection(db, 'friends'));
        const friendList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 取得したデータで画面の表示（exchangedUsers）を更新
        setExchangedUsers(friendList);
      } catch (error) {
        console.error('友達データの取得に失敗しました:', error);
      }
    };

    fetchFriends();
  }, []);
  
  return (
    <View style={styles.container}>
      {/* 2枚目の背景の線を敷き詰めるエリア */}
      <ImageBackground
        source={require('../assets/avatar/backline.png')} // 👈 保存した2枚目のノート線の画像パスを指定してください
        style={styles.bgContainer}
        resizeMode="cover"
      >
        {/* ヘッダーエリア */}
        <View style={styles.header}>
          <View>
            {/* 今月の月を取得して表示（例: 7月） */}
            <Text style={styles.monthText}>
            {new Date().getMonth() + 1}月
            </Text>
            <Text style={styles.countText}>{totalExchangeCount} 人</Text>
          </View>
          {/* 通知ベルボタン */}
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications" size={28} color="#F59E0B" />
          </TouchableOpacity>
        </View>

        {/* アバターたちが自由に配置されるメインのノートエリア */}
        <ScrollView contentContainerStyle={styles.avatarArea} showsVerticalScrollIndicator={false}>
        {exchangedUsers.length === 0 ? (
            // ① 最初（0人）のとき、またはデータが空のときの表示
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>まだ交換したアバターがいません</Text>
            <Text style={styles.emptySubText}>QRコードをスキャンして友達を追加しよう！</Text>
            </View>
        ) : (
            // ② データがある場合だけ、その人数分をループして配置する
            exchangedUsers.map((friend) => (
            <TouchableOpacity
                key={friend.id}
                style={[styles.avatarWrapper, { left: `${friend.position.left}%`, top: friend.position.top * 10 }]}
                onPress={() => handleOpenProfile(friend)}
                activeOpacity={0.8}
            >
                {/* 各アバター本体（丸の中にAvatarPreviewを収める） */}
                <View style={styles.avatarCircle}>
                <AvatarPreview
                    color={friend.avatar.color}
                    eye={friend.avatar.eye}
                    brow={friend.avatar.brow}
                    mouth={friend.avatar.mouth}
                />
                </View>

                {/* ギザギザの「NEW」バッジ */}
                {friend.isNew && (
                <View style={styles.newBadge}>
                    <AntDesign name="star" size={32} color="#FFF01C" style={styles.starIcon} />
                    <Text style={styles.newText}>NEW</Text>
                </View>
                )}
            </TouchableOpacity>
            ))
        )}
        </ScrollView>

        {/* 下部のフローティングボタン群（ナビゲーションとは別のアクションボタン） */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.circleMenuButton}>
            <AntDesign name="star" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.centerSubmitButton}>
            <Text style={styles.centerSubmitButtonText}>まとめてみる</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleMenuButton}>
            <AntDesign name="shopping-cart" size={24} color="#F59E0B" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* --- 3枚目: 顔タップ時のプロフィールポップアップ（モーダル表示） --- */}
      <Modal visible={profileVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.profileCard}>
            
            {/* 白フチの太いバツ（閉じる）ボタン */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setProfileVisible(false)}>
              <AntDesign name="close-circle" size={36} color="#000" />
            </TouchableOpacity>

            {/* 左上の飛び出すアバターアイコン */}
            {selectedFriend && (
              <View style={styles.popAvatarContainer}>
                <AvatarPreview
                  color={selectedFriend.avatar.color}
                  eye={selectedFriend.avatar.eye}
                  brow={selectedFriend.avatar.brow}
                  mouth={selectedFriend.avatar.mouth}
                />
              </View>
            )}

            {/* タイトル（〇〇のプロフィール） */}
            <Text style={styles.profileTitle}>
              {selectedFriend ? `${selectedFriend.name}のプロフィール` : 'プロフィール'}
            </Text>

            {/* 3枚目のグレーの真っ白（空っぽ）なエリア */}
            <View style={styles.emptyContentArea} />

            {/* 右下のクイズボタン */}
            <TouchableOpacity style={styles.quizButton}>
              <Text style={styles.quizButtonText}>クイズ</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2', 
  },
  bgContainer: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 16,
  },
  monthText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#3F2D20', 
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3F2D20',
    marginTop: 4,
  },
  bellButton: {
    backgroundColor: '#fff',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarArea: {
    height: height * 0.65, 
    position: 'relative',
  },
  avatarWrapper: {
    position: 'absolute',
    width: 90,
    height: 90,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#000',
    overflow: 'hidden',
  },
  newBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    position: 'absolute',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  newText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
    position: 'absolute',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  circleMenuButton: {
    backgroundColor: '#3B82F6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
  },
  centerSubmitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
  },
  centerSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // 🛠️ 3枚目のレイアウト：プロフィールポップアップのスタイル
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: width * 0.85,
    height: height * 0.65,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 6,
    borderColor: '#000', // イラスト風の極太黒フチ
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -18,
    right: -18,
    backgroundColor: '#fff',
    borderRadius: 20,
    zIndex: 10,
  },
  popAvatarContainer: {
    position: 'absolute',
    top: -45,
    left: -20,
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 5,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
    zIndex: 5,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
    paddingLeft: 40, 
  },
  emptyContentArea: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E5E7EB', // 3枚目画像の中央にある真っ白（グレー）な四角
    borderRadius: 8,
    marginBottom: 60, 
  },
  quizButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#111827', // 黒いクイズボタン
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60, 
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});