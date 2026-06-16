import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native'; 
import { useRouter } from 'expo-router';
import { loginStyles } from '../styles/loginStyles';
import { Ionicons } from '@expo/vector-icons'; // 🌟 SNSアイコン用

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🌟 SNSボタンを押した時のダミー関数
  const handleDummyPress = (provider: string) => {
    Alert.alert(`${provider}ログイン`, `${provider}でログインします。`);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground 
        source={require('@/assets/login-bg.png')} 
        style={loginStyles.container}
        resizeMode="cover" 
      >
        {/* ロゴ部分 */}
        {/* <Text style={loginStyles.logoText}>ろご</Text> */}

        {/* 白いカード */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={loginStyles.card}>
            <Text style={loginStyles.cardTitle}>ログイン</Text>

            {/* メールアドレス入力欄 */}
            <View style={loginStyles.inputContainer}>
              <Text style={loginStyles.inputLabel}>メールアドレス</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="Ecccon@gmail.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* パスワード入力欄 */}
            <View style={loginStyles.inputContainer}>
              <Text style={loginStyles.inputLabel}>パスワード</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="PassWard"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity onPress={() => Alert.alert("ヘルプ", "パスワード再設定へ")}>
              <Text style={loginStyles.forgotText}>パスワードが不明な場合</Text>
            </TouchableOpacity>

            <TouchableOpacity style={loginStyles.loginButton} onPress={() => Alert.alert("ログイン")}>
              <Text style={loginStyles.loginButtonText}>ログイン</Text>
            </TouchableOpacity>

            <TouchableOpacity style={loginStyles.registerButton} onPress={() => Alert.alert("新規登録")}>
              <Text style={loginStyles.registerButtonText}>新規登録</Text>
            </TouchableOpacity>

            {/* ーーー SNSログインボタンエリア ーーー */}
            <View style={loginStyles.snsButtonRow}>
              {/* Googleボタン */}
              <TouchableOpacity style={[loginStyles.snsButton, loginStyles.googleButton]} onPress={() => handleDummyPress("Google")} activeOpacity={0.7}>
                <Ionicons name="logo-google" size={26} color="#EA4335" />
              </TouchableOpacity>

              {/* Appleボタン */}
              <TouchableOpacity style={[loginStyles.snsButton, loginStyles.appleButton]} onPress={() => handleDummyPress("Apple")} activeOpacity={0.7}>
                <Ionicons name="logo-apple" size={26} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Discordボタン */}
              <TouchableOpacity style={[loginStyles.snsButton, loginStyles.discordButton]} onPress={() => handleDummyPress("Discord")} activeOpacity={0.7}>
                <Ionicons name="logo-discord" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}