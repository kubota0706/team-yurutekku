import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { AvatarPreview } from './AvatarPreview'; // このファイル
import { saveAvatarConfig } from './avatarService';

export default function AvatarEditScreen() {
  // ユーザーが今選択しているパーツの状態（State）
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedEye, setSelectedEye] = useState('normal');
  const [selectedBrow, setSelectedBrow] = useState('one');
  const [selectedMouth, setSelectedMouth] = useState('normal');

  const userId = "test_user_id"; // 実際はAuthなどから取得するID

  // 保存ボタンが押された時の処理
  const handleSave = async () => {
    // 4つのキーだけをギュッとまとめてFirestoreに送る！
    const currentConfig = {
      color: selectedColor,
      eye: selectedEye,
      brow: selectedBrow,
      mouth: selectedMouth,
    };
    await saveAvatarConfig(userId, currentConfig);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* 作ってくれたプレビューコンポーネントを表示 */}
      <AvatarPreview 
        color={selectedColor}
        eye={selectedEye}
        brow={selectedBrow}
        mouth={selectedMouth}
      />

      {/* --- ここにパーツを切り替えるボタン（省略） --- */}

      {/* 保存ボタン */}
      <Button title="このアバターで決定！" onPress={handleSave} />
    </View>
  );
}