import { useAtom } from 'jotai';
import { profileDataAtom, currentStepAtom, ProfileData, StepType } from '@/atoms/profileAtom';
import { router } from 'expo-router';
import { insertUserProfile } from '@/dao/firebaseRegister';
import { getLatestData } from '@/dao/firebaseGet';

// 💡 画面の並び順（Atomの型と完全一致させる）
const STEP_LISTS: readonly StepType[] = [
  "USER_NAME",
  "GENDER",
  "BIRTHDAY",
  "IMAGE",
  "BIO",
  "CONNECT_ADD",
  "CONFIRM"
] as const;

export const useProfileForm = () => {
  const [profileData, setProfileData] = useAtom(profileDataAtom);
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setCurrentStep((prev: StepType) => {
      const currentIndex = STEP_LISTS.indexOf(prev as any);
      if (currentIndex === -1) return prev;
      const nextIndex = Math.min(currentIndex + 1, STEP_LISTS.length - 1);
      return STEP_LISTS[nextIndex] as StepType;
    });
  };

  const prevStep = () => {
    setCurrentStep((prev: StepType) => {
      const currentIndex = STEP_LISTS.indexOf(prev as any);
      if (currentIndex === -1) return prev;
      const prevIndex = Math.max(currentIndex - 1, 0);
      return STEP_LISTS[prevIndex] as StepType;
    });
  };

  const handleRegisterSubmit = async () => {
    try {
      console.log('保存を開始します。最終データ:', profileData);
      
      await insertUserProfile(profileData, "test");
      
      router.replace('/'); 
    } catch (error) {
      console.error('[Hook] 登録に失敗しました:', error);
      alert('Firestoreへの保存に失敗しました。ターミナルのログまたはFirebase側のセキュリティルールを確認してください。');
    }
  };

  const loadProfileFromFirestore = async () => {
    try {
      const data = await getLatestData("test");
      if (data) setProfileData(data);
    } catch (error) {
      console.error('読み込み失敗:', error);
    }
  };

  return {
    profileData,
    currentStep,
    updateField,
    nextStep,
    prevStep,
    handleRegisterSubmit,
    loadProfileFromFirestore,
  };
};