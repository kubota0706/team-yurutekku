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
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    console.log("登録ボタン押された", email, password);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("成功", "登録が完了しました");
      router.push("/login");
    } catch (error) {
      console.error("登録エラー:", error);
      Alert.alert("エラー", "登録に失敗しました");
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Alert.alert("成功", "Googleで登録しました");
      router.push("/home");
    } catch (error) {
      Alert.alert("エラー", "Google登録に失敗しました");
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
          <Text style={loginStyles.cardTitle}>新規登録</Text>

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
            style={loginStyles.loginButton}
            onPress={handleRegister}
          >
            <Text style={loginStyles.loginButtonText}>登録する</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginStyles.registerButton}
            onPress={() => router.push("/login")}
          >
            <Text style={loginStyles.registerButtonText}>ログインに戻る</Text>
          </TouchableOpacity>

          <View style={loginStyles.snsButtonRow}>
            <TouchableOpacity
              style={[loginStyles.snsButton, loginStyles.googleButton]}
              onPress={handleGoogleRegister}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-google" size={26} color="#EA4335" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[loginStyles.snsButton, loginStyles.appleButton]}
              onPress={() => Alert.alert("Apple", "Appleで登録します")}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-apple" size={26} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[loginStyles.snsButton, loginStyles.discordButton]}
              onPress={() => Alert.alert("Discord", "Discordで登録します")}
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
