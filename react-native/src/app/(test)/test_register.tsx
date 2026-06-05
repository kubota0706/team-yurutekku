import React from 'react';
import { View, StyleSheet, Button, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useProfileForm } from '@/hooks/useProfileForm';
import { StepName, StepGender, StepBirthDate, StepAvatar, StepBio, StepAddres } from '@/components/register/StepComponents';

export default function RegisterScreen() {
  const { 
    profileData, 
    currentStep, 
    updateField, 
    nextStep, 
    prevStep, 
    handleRegisterSubmit 
  } = useProfileForm();

  // 日付の表示用ヘルパー
  const showDate = (date: Date | null) => {
    return date ? `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日` : '未設定';
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        
        {/* 1. 名前入力 */}
        {currentStep === 'USER_NAME' && (
          <StepName 
            value={profileData.userName} 
            onChange={(val) => updateField('userName', val)} 
            onNext={nextStep} 
          />
        )}

        {/* 2. 性別選択 */}
        {currentStep === 'GENDER' && (
          <StepGender 
            value={profileData.gender} 
            onChange={(val) => updateField('gender', val)} 
            onNext={nextStep} 
          />
        )}

        {/* 3. 生年月日入力 */}
        {currentStep === 'BIRTHDAY' && (
          <StepBirthDate 
            value={profileData.birthday} 
            onChange={(val) => updateField('birthday', val)} 
            onNext={nextStep} 
          />
        )}

        {/* 💡 4. アイコン選択 */}
        {currentStep === 'IMAGE' && (
          <StepAvatar 
            value={profileData.iconImagePath} 
            onChange={(val) => updateField('iconImagePath', val)} 
            onNext={nextStep} 
          />
        )}

        {/* 💡 5. 自己紹介文入力 */}
        {currentStep === 'BIO' && (
          <StepBio 
            value={profileData.bio} 
            onChange={(val) => updateField('bio', val)} 
            onNext={nextStep} 
          />
        )}

        {currentStep === 'CONNECT_ADD' && (
          <StepAddres 
            value={profileData.connectAdd}
            onChange={(val) => updateField('connectAdd', val)}
            onNext={nextStep}
          />
        )}

        {/* 6. 確認画面 */}
        {currentStep === 'CONFIRM' && (
          <View style={styles.confirmContainer}>
            <Text style={styles.title}>入力内容の確認</Text>
            <Text style={styles.infoText}>名前: {profileData.userName}</Text>
            <Text style={styles.infoText}>性別: {profileData.gender === 'male' ? '男性' : '女性'}</Text>
            <Text style={styles.infoText}>生年月日: {showDate(profileData.birthday)}</Text>
            <Text style={styles.infoText}>アイコン: {profileData.iconImagePath ? '設定あり' : '未設定'}</Text>
            <Text style={styles.infoText}>自己紹介: {profileData.bio || '未入力'}</Text>
            <Text style={styles.infoText}>連絡先: {profileData.connectAdd || '未入力'}</Text>

            <Button title="この内容で登録を完了する" onPress={handleRegisterSubmit} />
          </View>
        )}

        {/* 共通フッター（最初の画面以外で戻るボタンを出す） */}
        {currentStep !== 'USER_NAME' && (
          <View style={styles.footer}>
            <Button title="前へ戻る" onPress={prevStep} color="#666" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  confirmContainer: { gap: 15, width: '100%', paddingHorizontal: 30, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  infoText: { fontSize: 18, color: '#333', alignSelf: 'flex-start' },
  footer: { position: 'absolute', bottom: 50, width: '100%', paddingHorizontal: 20 },
});