import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  // 画面全体の背景（黄色）
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFE86C', // 🌟 ここでベースの黄色を塗る！
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 「ろご」未確定（画像）
  
  // 中央の白いカード
  card: {
    width: width * 0.85,
    backgroundColor: '#FFFEF0', // 少し温かみのある白
    borderRadius: 36,         // しっかりとした丸み
    padding: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFDD00',    // カードの黄色いフチ
    // Windows/Android用の影
    elevation: 8,
    // iOS用の影
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  // 「ログイン」の見出し
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C4017', // 焦げ茶色の文字
    marginBottom: 20,
  },
  // 入力エリアのまとまり
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  // 「メールアドレス」「パスワード」のラベル
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C4017',
    marginBottom: 4,
  },
  // テキスト入力枠
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#5C4017', // 茶色のフチ線
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333333',
  },
  // 「パスワードが不明な場合」のリンク
  forgotText: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#5C4017',
    marginBottom: 24,
  },
  // ログインボタン（青色）
  loginButton: {
    width: '80%',
    height: 52,
    backgroundColor: '#419AFF', // 爽やかな青色
    borderRadius: 26,         // 完全なカプセル型
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 新規登録ボタン（白ベース・青フチ）
  registerButton: {
    width: '80%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#419AFF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#419AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});