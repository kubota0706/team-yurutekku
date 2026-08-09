import React, { useState } from 'react';
import { Link, Redirect, useRouter } from 'expo-router';
// 💡 TextInput と ScrollView を追加インポート
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();
  const [path, setPath] = useState('');

  // 自由入力されたURL（パス）に遷移する関数
  const handleJump = () => {
    if (!path) return;
    
    // スラッシュの有無を自動で調整（(test)/test でも /(test)/test でも動くようにする）
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    
    try {
      router.push(formattedPath as any);
    } catch (error) {
      alert('無効なパス、またはファイルが存在しません。');
    }
  };

  const urlScrean = (
    // 画面外に入力フォームが隠れないよう ScrollView に変更
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>test</Text>

      {/* 🛠️ 自由URL入力フォームセクション */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="自由入力（例: (test)/test ）"
          placeholderTextColor="#999"
          value={path}
          onChangeText={setPath}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.inputButton} onPress={handleJump}>
          <Text style={styles.inputButtonText}>GO</Text>
        </TouchableOpacity>
      </View>

      <Link href="/profile" style={styles.link}>
        <Text style={styles.linkText}>テスト用プロフィールを確認</Text>
      </Link>

      <Link href="/home" style={styles.link}>
        <Text style={styles.linkText}>ホーム画面</Text>
      </Link>
      
      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>ログイン画面</Text>
      </Link>

    </ScrollView>
  )

  return null
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // ScrollView内で中央配置を維持するためflexから変更
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10, // 入力フォームとの間に少し隙間を作る
  },
  // 💡 追加した入力フォーム全体の横並びコンテナ
  searchSection: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 320,
    marginTop: 20,
    marginBottom: 10,
  },
  // 💡 テキスト入力欄のスタイル
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  // 💡 入力フォーム横のGOボタン
  inputButton: {
    width: 60,
    height: 50,
    backgroundColor: '#34C759', // 固定リンクと区別するために緑色に
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  inputButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 既存のボタンスタイル（横幅を100%にして最大幅を設定、見栄えを統一）
  link: {
    width: '100%',
    maxWidth: 320,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF', 
    alignItems: 'center', // 確実にテキストを中央に寄せる
    justifyContent: 'center',
    textAlign: 'center', // Web/Android環境向けの保険
  },
  linkText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});