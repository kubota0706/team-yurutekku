import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

export default function LoginScreen() {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user);
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <Text>Googleでログイン</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 12,
    backgroundColor: "#4285F4",
    borderRadius: 8,
  },
});
