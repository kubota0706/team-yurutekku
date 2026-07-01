import { useState } from 'react';
import { useAtom } from 'jotai';
import { profileDocAtom } from '@/atoms/profileDocAtom';
import { ProfileDoc } from '@/types/firebaseDoc';
import { registerProfileBase } from '@/dao/firebaseRegister';
import { useRouter } from 'expo-router';

export const useProfileForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [profileDoc, setProfileDoc] = useAtom(profileDocAtom);
  const [confirmErrorMessage, setConfirmErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    lastName: '', firstName: '', lastNameKana: '', firstNameKana: '',
    birthYear: '', birthMonth: '', birthDay: '', gender: null as string | null, location: '',
  });

  const updateForm = (key: keyof typeof formData, value: any) => 
    setFormData((prev) => ({ ...prev, [key]: value }));

  const getConfirmValidation = () => {
    const missingName = !formData.lastName.trim() || !formData.firstName.trim();
    const missingKana = !formData.lastNameKana.trim() || !formData.firstNameKana.trim();
    const missingBirthday = !formData.birthYear.trim() || !formData.birthMonth.trim() || !formData.birthDay.trim();
    const missingGender = !formData.gender;
    const missingLocation = !formData.location.trim();
    const hasMissing = missingName || missingKana || missingBirthday || missingGender || missingLocation;

    return { missingName, missingKana, missingBirthday, missingGender, missingLocation, hasMissing };
  };

  const handleNext = async () => {
    if (step < 3) {
      setConfirmErrorMessage('');
      setStep(step + 1);
    } else {
      const validation = getConfirmValidation();
      if (validation.hasMissing) {
        setConfirmErrorMessage('未入力の項目があります');
        return;
      }

      setConfirmErrorMessage('');
      const combinedProfile: ProfileDoc = {
        ...profileDoc,
        uid: 'test3', // TODO: 認証の実際のUIDに置き換え
        userName: `${formData.lastName} ${formData.firstName}`.trim() || null,
        gender: formData.gender === '男' ? 'male' : formData.gender === '女' ? 'female' : null,
        birthday: new Date(Number(formData.birthYear), Number(formData.birthMonth) - 1, Number(formData.birthDay)),
        connectAdd: formData.location || null,
        updatedAt: new Date(),
      };

      try {
        setProfileDoc(combinedProfile);
        await registerProfileBase(combinedProfile);
        // alert('登録完了');
        router.replace('/appDescription')
      } catch (error) {
        console.error('登録に失敗しました:', error);
        setConfirmErrorMessage('登録中に予期せぬエラーが発生しました');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return {
    step,
    formData,
    showLocationPicker,
    setShowLocationPicker,
    confirmErrorMessage,
    updateForm,
    getConfirmValidation,
    handleNext,
    handleBack,
  };
};