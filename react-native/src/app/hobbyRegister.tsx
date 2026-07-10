import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TextInput, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Image } from 'expo-image';
import { ActionButtons } from '@/components/ActionButtons';
import { usePreferenceRegister } from '@/hooks/usePreferenceRegister';
import { hobbyRegisterStyles as styles } from '@/styles/hobbyRegisterStyles';

export default function HobbyRegisterScreen() {
  const {
    step,
    currentStep,
    currentValue,
    errorMessage,
    isSaving,
    handleNext,
    handleBack,
    setCurrentValue,
    totalSteps,
  } = usePreferenceRegister('test3', 1);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.wrapper}
        >
          <View style={styles.content}>
            <View style={styles.questionBlock}>
              <Text style={[styles.screenTitle, step !== 1 && styles.hiddenTitle]}>自分のプロフィールを{`\n`}作成しましょう！</Text>
              <View style={styles.questionImageWrapper}>
                <Image source={currentStep.asset} style={styles.questionImage} contentFit="contain" />
              </View>
              <View style={styles.answerCard}>
                <TextInput
                  style={styles.textInput}
                  value={currentValue}
                  onChangeText={setCurrentValue}
                  textAlign="center"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={true}
                />
              </View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <ActionButtons
                onNext={handleNext}
                nextLabel={step === totalSteps ? (isSaving ? '保存中...' : '登録') : '次へ'}
                onBack={handleBack}
                showBack={step > 1}
                centered={false}
                setStyle={styles.buttonArea}
              />
              <View style={styles.dotContainer}>
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index + 1 === step ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}