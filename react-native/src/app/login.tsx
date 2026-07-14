import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Keyboard,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { loginStyles } from "../styles/loginStyles";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../dao/firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("ログインボタン押された", email, password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (error) {
      console.error("ログインエラー:", error);
      Alert.alert("エラー", "メールアドレスまたはパスワードが間違っています");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.replace("/home");
    } catch (error) {
      Alert.alert("エラー", "Googleログインに失敗しました");
    }
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/login-bg.png")}
        style={loginStyles.container}
        resizeMode="cover"
      >
        <View style={loginStyles.card}>
          <Text style={loginStyles.cardTitle}>ログイン</Text>

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

          <TouchableOpacity
            onPress={() => Alert.alert("ヘルプ", "パスワード再設定へ")}
          >
            <Text style={loginStyles.forgotText}>パスワードが不明な場合</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginStyles.loginButton}
            onPress={handleLogin}
          >
            <Text style={loginStyles.loginButtonText}>ログイン</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginStyles.registerButton}
            onPress={() => router.push("/register")}
          >
            <Text style={loginStyles.registerButtonText}>新規登録</Text>
          </TouchableOpacity>

          <View style={loginStyles.snsButtonRow}>
            <TouchableOpacity
              style={[loginStyles.snsButton, loginStyles.googleButton]}
              onPress={handleGoogleLogin}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-google" size={26} color="#EA4335" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[loginStyles.snsButton, loginStyles.appleButton]}
              onPress={() => Alert.alert("Apple", "Appleでログインします")}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-apple" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[loginStyles.snsButton, loginStyles.discordButton]}
              onPress={() => Alert.alert("Discord", "Discordでログインします")}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-discord" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}
