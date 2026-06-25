import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Modal, FlatList, TouchableWithoutFeedback, Keyboard, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { registerStyles as styles } from '@/styles/profileRegisterBaseStyles';

const PREFECTURES = ['北海道', '青森県', '岩手県', '宮城県', '福島県', '東京都', '神奈川県', '大阪府'];

// --- 画面専用の部品コンポーネント ---

const GenderButton = ({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) => (
  <TouchableOpacity style={[styles.genderButton, isSelected && styles.genderButtonSelected]} onPress={onPress}>
    <Text style={styles.genderButtonText}>{label}</Text>
  </TouchableOpacity>
);

const LocationModal = ({ visible, onClose, onSelect }: { visible: boolean, onClose: () => void, onSelect: (val: string) => void }) => (
  <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>出身地を選択</Text>
              <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity>
            </View>
            <FlatList
              data={PREFECTURES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.prefOption} onPress={() => onSelect(item)}>
                  <Text style={styles.prefOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

// --- メイン画面コンポーネント ---

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [formData, setFormData] = useState({
    lastName: '', firstName: '', lastNameKana: '', firstNameKana: '',
    birthYear: '', birthMonth: '', birthDay: '', gender: null as string | null, location: '',
  });

  const updateForm = (key: keyof typeof formData, value: any) => setFormData({ ...formData, [key]: value });
  const handleNext = () => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        alert('登録完了');
      }
    };

    const handleBack = () => {
      if (step > 1) {
        setStep(step - 1);
      }
    };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground source={require('@/assets/app-bg.png')} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} scrollEnabled={false} style={{marginTop: -40}}>
            <View style={styles.contentWrapper}>
              
              <View style={styles.titleContainer}>
                <Image 
                  source={require('@/assets/register-text.png')} 
                  style={styles.headerImage} 
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.stepContent}>
                {step !== 3 && (
                  <>
                  {step === 1 && (
                    <>
                      <View style={styles.inputContainerLarge}><Text style={styles.inputLabel}>名前</Text>
                        <View style={styles.inputRow}>
                          <TextInput style={styles.halfInput} placeholder="姓" value={formData.lastName} onChangeText={(v) => updateForm('lastName', v)} />
                          <TextInput style={styles.halfInput} placeholder="名" value={formData.firstName} onChangeText={(v) => updateForm('firstName', v)} />
                        </View>
                      </View>
                      <View style={styles.inputContainerLarge}><Text style={styles.inputLabel}>フリガナ</Text>
                        <View style={styles.inputRow}>
                          <TextInput style={styles.halfInput} placeholder="セイ" value={formData.lastNameKana} onChangeText={(v) => updateForm('lastNameKana', v)} />
                          <TextInput style={styles.halfInput} placeholder="メイ" value={formData.firstNameKana} onChangeText={(v) => updateForm('firstNameKana', v)} />
                        </View>
                      </View>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <View style={styles.inputContainer}><Text style={styles.inputLabel}>生年月日</Text>
                        <View style={styles.inputRow}>
                          <TextInput style={styles.dateInput} placeholder="年" keyboardType="number-pad" value={formData.birthYear} onChangeText={(v) => updateForm('birthYear', v)} />
                          <TextInput style={styles.dateInput} placeholder="月" keyboardType="number-pad" value={formData.birthMonth} onChangeText={(v) => updateForm('birthMonth', v)} />
                          <TextInput style={styles.dateInput} placeholder="日" keyboardType="number-pad" value={formData.birthDay} onChangeText={(v) => updateForm('birthDay', v)} />
                        </View>
                      </View>
                      <View style={styles.inputContainer}><Text style={styles.inputLabel}>性別</Text>
                        <View style={styles.inputRow}>
                          {['男', '女', 'ひみつ'].map((label) => (
                            <GenderButton key={label} label={label} isSelected={formData.gender === label} onPress={() => updateForm('gender', label)} />
                          ))}
                        </View>
                      </View>
                      <View style={styles.inputContainer}><Text style={styles.inputLabel}>出身地</Text>
                        <TouchableOpacity style={styles.selectInput} onPress={() => setShowLocationPicker(true)}>
                          <Text style={[styles.selectText, !formData.location && styles.selectTextPlaceholder]}>{formData.location || '選択してください'}</Text>
                          <Ionicons name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  </>
                )}
                
                { step === 3 && (
                  <View style={styles.cardContainer}>
                    <Text style={styles.confirmTitle}>この内容で間違いありませんか？</Text>
                    
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>名前</Text>
                      <Text style={styles.confirmValue}>{formData.lastName} {formData.firstName}</Text>
                    </View>
                    
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>フリガナ</Text>
                      <Text style={styles.confirmValue}>{formData.lastNameKana} {formData.firstNameKana}</Text>
                    </View>
                    
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>メールアドレス</Text>
                      <Text style={styles.confirmValue}>test@example.com(テスト用)</Text>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>生年月日</Text>
                      <Text style={styles.confirmValue}>{formData.birthYear}年{formData.birthMonth}月{formData.birthDay}日</Text>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>性別</Text>
                      <Text style={styles.confirmValue}>{formData.gender}</Text>
                    </View>

                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>出身地</Text>
                      <Text style={styles.confirmValue}>{formData.location}</Text>
                    </View>

	                <View style={styles.buttonRow}>

						<TouchableOpacity style={styles.backButton} onPress={handleBack}><Text style={styles.backButtonText}>戻る</Text></TouchableOpacity>
						<TouchableOpacity style={styles.nextButton} onPress={handleNext}><Text style={styles.nextButtonText}>確定</Text></TouchableOpacity>
					</View>

                  </View>

                )}
              </View>

              <View style={{ flex: 1 }} />

              <View style={styles.buttonArea}>
                <View style={styles.buttonRow}>
                  {step == 2 ? (
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}><Text style={styles.backButtonText}>戻る</Text></TouchableOpacity>
                  ) : <View style={{ flex: 1 }} />}
                  { step !== 3 && (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}><Text style={styles.nextButtonText}>次へ</Text></TouchableOpacity>
                  )}
                </View>
              </View>
              
            </View>
          </ScrollView>
        </SafeAreaView>

        <LocationModal 
          visible={showLocationPicker} 
          onClose={() => setShowLocationPicker(false)} 
          onSelect={(item) => { updateForm('location', item); setShowLocationPicker(false); }} 
        />
      </ImageBackground>
    </TouchableWithoutFeedback>
    
  );
}