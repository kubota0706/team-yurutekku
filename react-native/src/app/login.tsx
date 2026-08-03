import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ImageBackground, // 💡 画像を背景として使用するためにインポート
} from 'react-native';
import { styles } from '../styles/loginStyles'; // 💡 スタイルファイルを分離

// 💡 画像のパス。環境に合わせて調整してください。
const bgImageSource = require('@/assets/login.png'); // ここに背景画像のパスを指定してください
// (例) もし同じ階層なら require('./grid-bg.png') など
// もし assets フォルダに置いていない場合は、コメントアウトしたままで、ダミーのロゴ画像（パターンB）の手法を取ります。
// assets フォルダへの配置を推奨します。

type AuthMode = 'login' | 'signup' | 'sent';

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 💡 コンテンツをレンダリングする関数
  const renderContent = () => {
    switch (mode) {
      case 'login':
        return (
          <View style={styles.card}>
            <Text style={styles.title}>ログイン</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>メールアドレス</Text>
              <TextInput
                style={styles.input}
                placeholder="yurutekku@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>パスワード</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>パスワードを忘れた場合</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => console.log('Login')}>
                <Text style={styles.primaryBtnText}>ログイン</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setMode('signup')}>
                <Text style={styles.secondaryBtnText}>新規登録</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'signup':
        return (
          <View style={styles.card}>
            <Text style={styles.title}>新規登録</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>メールアドレス</Text>
              <TextInput
                style={styles.input}
                placeholder="yurutekku@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>パ ス ワ ー ド</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('sent')}>
                <Text style={styles.primaryBtnText}>次へ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setMode('login')}>
                <Text style={styles.secondaryBtnText}>ログインに戻る</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'sent':
        return (
          <View style={styles.card}>
            <Text style={styles.title}>メールを送信しました</Text>
            
            <Text style={styles.messageText}>
              入力されたメールアドレスに認証メールを送信しました。メール内のリンクをクリックして登録を完了させてください。
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => setMode('login')}>
                <Text style={styles.primaryBtnText}>閉じる</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    // 💡 ImageBackground をルートとして使用
    <ImageBackground
      source={bgImageSource} // 💡 差し込みたい画像を指定
      style={styles.backgroundImage}
      resizeMode="cover" // 💡 画面全体を覆うように設定
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            {/* 💡 パターンA: ロゴ画像がある場合 */}
            <Image
              source={require('@/assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            
            {/* 💡 パターンB: ロゴ画像がない場合（ダミー） */}
            {/* <Text style={{fontSize: 32, fontWeight: '900', color: '#4E3117'}}>YURUTEKKU</Text> */}
          </View>

          {renderContent()}

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}