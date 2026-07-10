import { useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'expo-router';
import { preferencesAtom } from '@/atoms/profileDocAtom';
import { preferences } from '@/types/firebaseDoc';
import { saveUserPreferences } from '@/dao/profileRegister';

export type PreferenceField = Exclude<keyof preferences, 'uid'>;

const preferenceSteps: Array<{
  type: PreferenceField;
  asset: any;
  placeholder: string;
}> = [
  {
    type: 'movie',
    asset: require('@/assets/text/旅行したい場所.png'),
    placeholder: '旅行したい場所を入力してください',
  },
  {
    type: 'likedFood',
    asset: require('@/assets/text/好きな食べ物は？.png'),
    placeholder: '好きな食べ物を入力してください',
  },
  {
    type: 'hobby',
    asset: require('@/assets/text/趣味は？.png'),
    placeholder: '趣味や興味のあることを入力してください',
  },
  {
    type: 'skill',
    asset: require('@/assets/text/得意なことは？.png'),
    placeholder: '得意なことを入力してください',
  },
];

export const usePreferenceRegister = (uid: string, version: number) => {
  const router = useRouter();
  const [preferences, setPreferences] = useAtom(preferencesAtom);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentStepIndex = step - 1;
  const currentStep = preferenceSteps[currentStepIndex];
  const currentValue = preferences[currentStep.type] || '';

  const setCurrentValue = (value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [currentStep.type]: value,
    }));
  };

  const handleNext = async () => {
    setErrorMessage('');

    if (currentValue.trim().length === 0) {
      setErrorMessage('入力内容を入力してください。');
      return;
    }

    if (step < preferenceSteps.length) {
      setStep(step + 1);
      return;
    }

    if (!uid) {
      setErrorMessage('ユーザーIDが取得できませんでした。');
      return;
    }

    setIsSaving(true);

    try {
      await saveUserPreferences(uid, version, {
        ...preferences,
        uid,
      });
      router.replace('/');
    } catch (error) {
      console.error('[usePreferenceRegister] 保存エラー', error);
      setErrorMessage('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMessage('');
    }
  };

  return {
    step,
    currentStep,
    currentValue,
    isSaving,
    errorMessage,
    handleNext,
    handleBack,
    setCurrentValue,
    totalSteps: preferenceSteps.length,
  };
};
