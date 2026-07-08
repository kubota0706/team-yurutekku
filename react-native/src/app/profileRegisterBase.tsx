import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { registerStyles as styles } from "@/styles/profileRegisterBaseStyles";
import { ActionButtons } from "@/components/ActionButtons";
import { useProfileForm } from "@/hooks/useProfileRegisterBaseForm";
import GenericSelectionModal from "@/components/GenericSelectionModal";
import { PREFECTURES } from "@/constants/prefectures";
import { SelectionTrigger } from "@/components/SelectionTrigger";

// 年月日選択モーダル用配列
const currentYear = new Date().getFullYear(); // 実行時の現在の年（例: 2026）を取得
const startYear = 1900;
const totalYears = currentYear - startYear + 1;
// 年配列
const yearsData = Array.from({ length: totalYears }, (_, i) =>
  String(currentYear - i),
); // 現在の年から1900年までを降順で生成
// 月配列
const monthsData = Array.from({ length: 12 }, (_, i) => String(i + 1));
// 日配列
const daysData = Array.from({ length: 31 }, (_, i) => String(i + 1));

const getModalConfig = (type: "year" | "month" | "day" | "location" | null) => {
  switch (type) {
    case "year":
      return {
        data: yearsData,
        title: "年を選択",
        placeholder: "年を検索",
        keyboardType: "number-pad" as const,
      };
    case "month":
      return {
        data: monthsData,
        title: "月を選択",
        placeholder: "月を検索",
        keyboardType: "number-pad" as const,
      };
    case "day":
      return {
        data: daysData,
        title: "日を選択",
        placeholder: "日付を検索",
        keyboardType: "number-pad" as const,
      };
    case "location":
      return {
        data: PREFECTURES,
        title: "出身地を選択",
        placeholder: "都道府県を検索",
        keyboardType: "default" as const,
      };
    default:
      return null;
  }
};

// --- 画面専用の部品コンポーネント ---

const GenderButton = ({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.genderButton, isSelected && styles.genderButtonSelected]}
    onPress={onPress}
  >
    <Text style={styles.genderButtonText}>{label}</Text>
  </TouchableOpacity>
);

// --- メイン画面コンポーネント ---

export default function RegisterScreen() {
  const {
    step,
    formData,
    confirmErrorMessage,
    updateForm,
    getConfirmValidation,
    handleNext,
    handleBack,
  } = useProfileForm();

  const [activeModal, setActiveModal] = React.useState<
    "year" | "month" | "day" | "location" | null
  >(null);

  // 現在のモードに応じた設定を取得
  const currentModalConfig = getModalConfig(activeModal);

  // 値が選択されたときの振り分けロジック
  const handleSelect = (val: string) => {
    if (activeModal === "year") updateForm("birthYear", val);
    if (activeModal === "month") updateForm("birthMonth", val);
    if (activeModal === "day") updateForm("birthDay", val);
    if (activeModal === "location") updateForm("location", val);
    setActiveModal(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("@/assets/app-bg.png")}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            style={{ marginTop: -40 }}
          >
            <View style={styles.contentWrapper}>
              <View style={styles.titleContainer}>
                <Image
                  source={require("@/assets/register-text.png")}
                  style={styles.headerImage}
                  //   resizeMode="contain"
                  contentFit="cover"
                  transition={200}
                />
              </View>

              <View style={styles.stepContent}>
                {step !== 3 && (
                  <>
                    {step === 1 && (
                      <>
                        <View style={styles.inputContainerLarge}>
                          <Text style={styles.inputLabel}>名前</Text>
                          <View style={styles.inputRow}>
                            <TextInput
                              style={styles.halfInput}
                              placeholder="姓"
                              placeholderTextColor="#7A7A7A"
                              value={formData.lastName ?? ''}
                              returnKeyType="done"
                              onSubmitEditing={() => Keyboard.dismiss()}
                              onChangeText={(v) => updateForm("lastName", v)}
                            />
                            <TextInput
                              style={styles.halfInput}
                              placeholder="名"
                              placeholderTextColor="#7A7A7A"
                              value={formData.firstName ?? ''}
                              returnKeyType="done"
                              onSubmitEditing={() => Keyboard.dismiss()}
                              onChangeText={(v) => updateForm("firstName", v)}
                            />
                          </View>
                        </View>
                        <View style={styles.inputContainerLarge}>
                          <Text style={styles.inputLabel}>フリガナ</Text>
                          <View style={styles.inputRow}>
                            <TextInput
                              style={styles.halfInput}
                              placeholder="セイ"
                              placeholderTextColor="#7A7A7A"
                              value={formData.lastNameKana ?? ''}
                              returnKeyType="done"
                              onSubmitEditing={() => Keyboard.dismiss()}
                              onChangeText={(v) =>
                                updateForm("lastNameKana", v)
                              }
                            />
                            <TextInput
                              style={styles.halfInput}
                              placeholder="メイ"
                              placeholderTextColor="#7A7A7A"
                              value={formData.firstNameKana ?? ''}
                              returnKeyType="done"
                              onSubmitEditing={() => Keyboard.dismiss()}
                              onChangeText={(v) =>
                                updateForm("firstNameKana", v)
                              }
                            />
                          </View>
                        </View>
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>生年月日</Text>
                          <View style={styles.inputRow}>
                            <SelectionTrigger
                              value={formData.birthYear} // 現在フォームに入っている値（オブジェクトの構造に合わせて変更してください）
                              placeholder="年"
                              onPress={() => setActiveModal("year")}
                              containerStyle={styles.dateInput}
                              other="年"
                            />
                            <SelectionTrigger
                              value={formData.birthMonth} // 現在フォームに入っている値（オブジェクトの構造に合わせて変更してください）
                              placeholder="月"
                              onPress={() => setActiveModal("month")}
                              containerStyle={styles.dateInput}
                              other="月"
                            />
                            <SelectionTrigger
                              value={formData.birthDay} // 現在フォームに入っている値（オブジェクトの構造に合わせて変更してください）
                              placeholder="日"
                              onPress={() => setActiveModal("day")}
                              containerStyle={styles.dateInput}
                              other="日"
                            />
                          </View>
                        </View>
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>性別</Text>
                          <View style={styles.inputRow}>
                            {["男", "女", "ひみつ"].map((label) => (
                              <GenderButton
                                key={label}
                                label={label}
                                isSelected={formData.gender === label}
                                onPress={() => updateForm("gender", label)}
                              />
                            ))}
                          </View>
                        </View>
                        <View style={styles.inputContainer}>
                          <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>出身地</Text>
                            {/* 出身地のトリガー */}
                            <SelectionTrigger
                              value={formData.location}
                              placeholder="出身地を選択"
                              onPress={() => setActiveModal("location")} // 💡 "location" をセット
                            />
                          </View>
                          {currentModalConfig && (
                            <GenericSelectionModal
                              visible={true} // 表示対象のときだけマウントされるので常にtrueでOK
                              onClose={() => setActiveModal(null)}
                              onSelect={handleSelect}
                              data={currentModalConfig.data}
                              title={currentModalConfig.title}
                              placeholder={currentModalConfig.placeholder}
                              keyboardType={currentModalConfig.keyboardType}
                            />
                          )}
                        </View>
                      </>
                    )}
                  </>
                )}

                {step === 3 && (
                  <View style={styles.cardContainer}>
                    <Text style={styles.confirmTitle}>
                      この内容で間違いありませんか？
                    </Text>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>名前</Text>
                      <View style={styles.confirmValueWrapper}>
                        <Text style={styles.confirmValue}>
                          {formData.lastName} {formData.firstName}
                        </Text>
                        {getConfirmValidation().missingName && (
                          <Text style={styles.errorText}>未入力</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>フリガナ</Text>
                      <View style={styles.confirmValueWrapper}>
                        <Text style={styles.confirmValue}>
                          {formData.lastNameKana} {formData.firstNameKana}
                        </Text>
                        {getConfirmValidation().missingKana && (
                          <Text style={styles.errorText}>未入力</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>メールアドレス</Text>
                      <Text style={styles.confirmValue}>
                        test@example.com(テスト用)
                      </Text>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>生年月日</Text>
                      <View style={styles.confirmValueWrapper}>
                        {!getConfirmValidation().missingBirthday && (
                          <Text style={styles.confirmValue}>
                            {formData.birthYear}年{formData.birthMonth}月
                            {formData.birthDay}日
                          </Text>
                        )}
                        {getConfirmValidation().missingBirthday && (
                          <Text style={styles.errorText}>入力値が不正</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>性別</Text>
                      <View style={styles.confirmValueWrapper}>
                        <Text style={styles.confirmValue}>
                          {formData.gender}
                        </Text>
                        {getConfirmValidation().missingGender && (
                          <Text style={styles.errorText}>未入力</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>出身地</Text>
                      <View style={styles.confirmValueWrapper}>
                        <Text style={styles.confirmValue}>
                          {formData.location}
                        </Text>
                        {getConfirmValidation().missingLocation && (
                          <Text style={styles.errorText}>未入力</Text>
                        )}
                      </View>
                    </View>

                    <ActionButtons
                      showBack
                      onBack={handleBack}
                      backLabel="戻る"
                      onNext={handleNext}
                      nextLabel="確定"
                    />
                    {confirmErrorMessage ? (
                      <Text style={styles.submitErrorText}>
                        {confirmErrorMessage}
                      </Text>
                    ) : null}
                  </View>
                )}
              </View>

              <View style={{ flex: 1 }} />

              <View style={styles.buttonArea}>
                {step !== 3 && (
                  <ActionButtons
                    showBack={step === 2}
                    onBack={handleBack}
                    backLabel="戻る"
                    onNext={handleNext}
                    nextLabel="次へ"
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
