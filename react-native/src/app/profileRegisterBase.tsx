import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { registerStyles as styles } from "@/styles/profileRegisterBaseStyles";
import { ActionButtons } from "@/components/ActionButtons";
import { useProfileForm } from "@/hooks/useProfileRegisterBaseForm";
import { PREFECTURES } from "@/constants/prefectures";
import LocationModal from "@/components/prefecturesModal";

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
    showLocationPicker,
    setShowLocationPicker,
    confirmErrorMessage,
    updateForm,
    getConfirmValidation,
    handleNext,
    handleBack,
  } = useProfileForm();

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
                  resizeMode="contain"
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
                              value={formData.lastName}
                              returnKeyType="done"
                              onSubmitEditing={() => Keyboard.dismiss()}
                              onChangeText={(v) => updateForm("lastName", v)}
                            />
                            <TextInput
                              style={styles.halfInput}
                              placeholder="名"
                              value={formData.firstName}
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
                              value={formData.lastNameKana}
                              returnKeyType="done"
                              onSubmitEditing={() => Keyboard.dismiss()}
                              onChangeText={(v) =>
                                updateForm("lastNameKana", v)
                              }
                            />
                            <TextInput
                              style={styles.halfInput}
                              placeholder="メイ"
                              value={formData.firstNameKana}
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
                            <TextInput
                              style={styles.dateInput}
                              placeholder="年"
                              keyboardType="number-pad"
                              value={formData.birthYear}
                              onChangeText={(v) => updateForm("birthYear", v)}
                            />
                            <TextInput
                              style={styles.dateInput}
                              placeholder="月"
                              keyboardType="number-pad"
                              value={formData.birthMonth}
                              onChangeText={(v) => updateForm("birthMonth", v)}
                            />
                            <TextInput
                              style={styles.dateInput}
                              placeholder="日"
                              keyboardType="number-pad"
                              value={formData.birthDay}
                              onChangeText={(v) => updateForm("birthDay", v)}
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
                          <Text style={styles.inputLabel}>出身地</Text>
                          <TouchableOpacity
                            style={styles.selectInput}
                            onPress={() => setShowLocationPicker(true)}
                          >
                            <Text
                              style={[
                                styles.selectText,
                                !formData.location &&
                                  styles.selectTextPlaceholder,
                              ]}
                            >
                              {formData.location || "選択してください"}
                            </Text>
                            <Ionicons
                              name="chevron-down"
                              size={20}
                              color="#666"
                            />
                          </TouchableOpacity>
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
                          <Text style={styles.errorText}>未入力</Text>
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

        <LocationModal
          visible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSelect={(item) => {
            updateForm("location", item);
            setShowLocationPicker(false);
          }}
        />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
