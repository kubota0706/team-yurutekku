import { StyleSheet } from "react-native";

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDD48",
    width: "100%",
    height: "100%",
  },
  safeArea: { flex: 1 },
  contentWrapper: {
    flex: 1,
    padding: 24,
  }, // 全体をラップしてボタンを下に押し出す

  titleContainer: { marginTop: 40, marginBottom: 40, alignItems: "center" },
  headerImage: {
    width: 150,
    aspectRatio: 3,
  },

  stepContent: { width: "100%" },
  // 氏名欄用：スペースを広めにとる
  inputContainerLarge: { width: "100%", marginBottom: 40 },
  // 通常欄用：スペースを狭めに調整
  inputContainer: { width: "100%", marginBottom: 20 },

  inputLabel: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothic_900Black',
    fontWeight: "bold",
    color: "#553311",
    marginBottom: 6,
    paddingLeft: 4,
  },
  inputRow: { flexDirection: "row", gap: 12 },

  halfInput: {
    flex: 1,
    height: 48,
    borderWidth: 4.5,
    borderColor: "#443322",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 16,
  },
  dateInput: {
    flex: 1,
    height: 48,
    borderWidth: 4.5,
    borderColor: "#443322",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    fontSize: 16,
    textAlign: "center",
  },

  genderButton: {
    flex: 1,
    height: 48,
    borderWidth: 4.5,
    borderColor: "#443322",
    borderRadius: 12,
    backgroundColor: "#FFFFFF", // 白背景
    justifyContent: "center",
    alignItems: "center",
  },
  // 性別選択ボタン（選択時）
  genderButtonSelected: {
    backgroundColor: "#FFE352", // 選択時は背景を黄色に
    borderColor: "#443322", // 枠線はそのまま
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#443322", // 通常時の文字色
  },

  selectInput: {
    width: "100%",
    height: 48,
    borderWidth: 4.5,
    borderColor: "#443322",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: { fontSize: 16, color: "#333" },
  selectTextPlaceholder: { color: "#A0A0A0" },

  buttonArea: { width: "100%", paddingBottom: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFDF0",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "60%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#332211",
  },
  prefOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  prefOptionText: {
    fontSize: 16,
    color: "#333",
  },
  cardContainer: {
    backgroundColor: "#FFFEF5", // 背景色のクリーム色
    borderRadius: 24, // 画像のような丸い角
    padding: 24, // 内側の余白
    marginHorizontal: 20, // 左右の余白
    // 影の設定（iOS）
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // 影の設定（Android）
    elevation: 6,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  confirmLabel: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothic_900Black',
    color: "#666",
    flex: 1,
  },
  confirmValue: {
    fontSize: 14,
    fontFamily: 'ZenMaruGothic_500Medium',
    color: "#333",
    flex: 1.5, // 値側を少し広く取る
  },
  confirmValueWrapper: {
    flex: 1.5,
    alignItems: "flex-end",
  },
  errorText: {
    marginTop: 4,
    color: "#D60000",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  submitErrorText: {
    marginTop: 16,
    color: "#D60000",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export const prefecturesModalStyles = StyleSheet.create({
  // 🔍 検索窓全体の配置コンテナ
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // 👈 画面の太枠・角丸を再現した入力枠
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3, // 画面の太い黒枠に合わせる
    borderColor: "#000",
    borderRadius: 12,
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    height: 48,
  },

  // テキストインプットの文字入力エリア
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  // 都道府県リストの各行の調整
  prefOptionCustom: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 14,
  },
});
