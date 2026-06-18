import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE352', // カンプの鮮やかな黄色
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle: {
    position: 'absolute',
    backgroundColor: '#FFF19E', // 背景に浮いている薄い黄色の円
    opacity: 0.6,
  },
  logoText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: 4,
  },
  card: {
    width: width * 0.88,
    backgroundColor: '#FFFDF0', // カンプ特有の、少し温かみのあるアイボリーホワイト
    borderRadius: 36, // カンプのような大きな丸み
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 36,
    alignItems: 'center',
    // 影の設定（カンプの下側のやわらかいシャドウ）
    shadowColor: '#A38F1A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTitle: { 
    fontSize: 24,
    fontWeight: 'bold',
    color: '#332211', // 少し茶色みがかった柔らかい黒
    marginBottom: 20,
    letterSpacing: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#553311',
    marginBottom: 6,
    paddingLeft: 4,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#443322', // クレよんのような可愛い黒い細枠
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  forgotContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#553311',
    textDecorationLine: 'underline', // 下線
  },
  loginButton: {
    width: '70%',
    height: 54,
    backgroundColor: '#4293FF', // カンプ通りの爽やかな青
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  registerButton: {
    width: '70%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4293FF', // 青いフチ取り
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  registerButtonText: {
    color: '#4293FF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  
  // 🌟 ここから下が結合されたSNS用のスタイルです
  snsButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    width: '100%',
  },
  snsButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0DCC5',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderColor: '#000000', // 白いフチが見えないよう背景と同色に調整
  },
  discordButton: {
    backgroundColor: '#5865F2',
    borderColor: '#5865F2', // 枠線をDiscordカラーに同化
  },
});