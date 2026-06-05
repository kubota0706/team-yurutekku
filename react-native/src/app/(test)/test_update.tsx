import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAtom } from 'jotai';
// 💡 元のファイル構造のまま「profileDataAtom」をインポート
import { profileDataAtom, ProfileData } from '@/atoms/profileAtom';
import { insertUserProfile } from '@/dao/firebaseUpdate';

// 🧪 テスト用のダミー画像アップロード関数
const mockUploadImage = async (localUri: string): Promise<string> => {
  console.log('[TestMock] 画像のアップロードをシミュレート中...', localUri);
  return new Promise((resolve) => {
    setTimeout(() => {
      // アップロード成功後に返ってくる想定の Firebase Storage のダミーURL
      resolve('https://firebasestorage.googleapis.com/v0/b/mock-project.appspot.com/o/profiles%2Ftest_avatar.jpg?alt=media&token=abcdef-123456');
    }, 1000);
  });
};

export default function TestUpdateScreen() {
  // 💡 既存のアトム名「profileDataAtom」を使用
  const [profileData, setProfileData] = useAtom(profileDataAtom);
  const [loading, setLoading] = useState(false);

  // 生年月日のテキスト入力用ローカルステート
  const [birthdayText, setBirthdayText] = useState(
    profileData.birthday ? profileData.birthday.toISOString().split('T')[0] : ''
  );

  // フォームの入力値を変更するハンドラー
  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // アップデート処理をトリガーするハンドラー
  const handleUpdate = async () => {
    if (!profileData.userName || !profileData.bio) {
      Alert.alert('入力エラー', 'ユーザー名と自己紹介文を入力してください。');
      return;
    }

    setLoading(true);
    try {
      console.log('[TestView] アップデート処理を開始します...');

      let finalImageUrl = profileData.iconImagePath;

      // 1. 画像パスがローカルファイルかチェック
      const isLocalFile = 
        finalImageUrl && 
        (finalImageUrl.startsWith('file://') || finalImageUrl.startsWith('content://'));

      if (isLocalFile && finalImageUrl) {
        console.log('[TestView] 未アップロードのローカル画像を検出。Storageへアップロードします。');
        
        finalImageUrl = await mockUploadImage(finalImageUrl);
        
        console.log('[TestView] Storageアップロード成功。URL:', finalImageUrl);
        
        setProfileData((prev) => ({
          ...prev,
          iconImagePath: finalImageUrl,
        }));
      }

      // 2. テスト画面に入力された日付文字列を Date オブジェクトに変換
      const parsedDate = birthdayText ? new Date(birthdayText) : null;
      if (birthdayText && (parsedDate === null || isNaN(parsedDate.getTime()))) {
        throw new Error('生年月日のフォーマットが不正です。YYYY-MM-DD で入力してください。');
      }

      // 3. Firestoreへ渡す最終的なオブジェクトを構築
      const finalProfileData: ProfileData = {
        ...profileData,
        iconImagePath: finalImageUrl,
        birthday: parsedDate,
      };

      // 4. Firestoreへの書き込み実行
      await insertUserProfile(finalProfileData);

      console.log('[TestView] すべての更新処理が正常に完了しました。');
      Alert.alert('成功', 'プロフィールの更新に成功しました！(UID: test)');

    } catch (error: any) {
      console.error('[TestView] 更新処理中にエラーが発生しました:', error);
      Alert.alert('エラー', error.message || '更新に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  // 🧪 テスト用に長いパスをセットして、テキストエリアの折り返しを確認しやすくします
  const handleSimulateSelectImage = () => {
    const dummyLocalPath = 'file:///var/mobile/Containers/Data/Application/EXPO_CACHE/Camera/test-image-generated-by-picker-shd8923hjkda89123.jpg';
    handleInputChange('iconImagePath', dummyLocalPath);
    Alert.alert('シミュレート', 'テスト用の長いローカル画像パスをセットしました。');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Firestore & Storage アップデートテスト</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>ユーザー名 (userName):</Text>
        <TextInput
          style={styles.input}
          value={profileData.userName ?? ''}
          onChangeText={(val) => handleInputChange('userName', val || null)}
          placeholder="ユーザー名を入力"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>自己紹介文 (bio):</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={profileData.bio ?? ''}
          onChangeText={(val) => handleInputChange('bio', val || null)}
          placeholder="自己紹介文を入力"
          multiline
        />
      </View>

      {/* 💡 画像パスの入力欄をテキストエリア（複数行）に変更 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>画像パス (iconImagePath):</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={profileData.iconImagePath ?? ''}
          onChangeText={(val) => handleInputChange('iconImagePath', val || null)}
          placeholder="URL または file:// パス"
          multiline
        />
        <View style={styles.rowButton}>
          <Button title="擬似ローカルパスをセット" onPress={handleSimulateSelectImage} color="#666" />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>性別 (gender):</Text>
        <TextInput
          style={styles.input}
          value={profileData.gender ?? ''}
          onChangeText={(val) => handleInputChange('gender', val.toLowerCase().trim())}
          placeholder="male または female"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>生年月日 (birthday - YYYY-MM-DD):</Text>
        <TextInput
          style={styles.input}
          value={birthdayText}
          onChangeText={(val) => setBirthdayText(val)}
          placeholder="2000-01-01"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spacer} />
      ) : (
        <View style={styles.submitButton}>
          <Button title="Firebaseにアップロード＆保存" onPress={handleUpdate} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, fontSize: 15 },
  textArea: { height: 80, textAlignVertical: 'top' }, // 💡 高さを固定して上揃えにするスタイル
  rowButton: { marginTop: 5, alignItems: 'flex-start' },
  spacer: { marginVertical: 20 },
  submitButton: { marginTop: 20, marginBottom: 40 },
});