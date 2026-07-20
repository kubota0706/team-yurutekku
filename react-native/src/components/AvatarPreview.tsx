import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { saveAvatarConfig } from './avatarService';

// --- イラスト素材（画像パス）の辞書定義 ---
export const faceImages: { [key: string]: any } = {
  blue: require('../assets/avatar/faces/blue.png'),
  red: require('../assets/avatar/faces/red.png'),
  yellow: require('../assets/avatar/faces/yellow.png'),
  green: require('../assets/avatar/faces/green.png'),
  Purple: require('../assets/avatar/faces/purple.png'),
  Pink: require('../assets/avatar/faces/pink.png'),
};

export const eyeImages: { [key: string]: any } = {
  normal: require('../assets/avatar/eyes/eye1.png'),
  sleepy: require('../assets/avatar/eyes/eye4.png'),
  angry: require('../assets/avatar/eyes/eye2.png'),
  smile: require('../assets/avatar/eyes/eye3.png'),
  smirk: require('../assets/avatar/eyes/eye5.png'),
  slant: require('../assets/avatar/eyes/eye6.png'),
};

export const browImages: { [key: string]: any } = {
  none: null, // 眉なし
  one: require('../assets/avatar/brows/brows1.png'),
  droopy : require('../assets/avatar/brows/brows4.png'),
  angry: require('../assets/avatar/brows/brows2.png'),
  slanting: require('../assets/avatar/brows/brows3.png'),
  problems: require('../assets/avatar/brows/brows5.png'),
};

export const mouthImages: { [key: string]: any } = {
  normal: require('../assets/avatar/mouths/mouths1.png'),
  smile: require('../assets/avatar/mouths/mouths4.png'),
  open: require('../assets/avatar/mouths/mouths2.png'),
  sad: require('../assets/avatar/mouths/mouths5.png'),
  circle: require('../assets/avatar/mouths/mouths3.png'),
  lick: require('../assets/avatar/mouths/mouths6.png'),
};

interface AvatarPreviewProps {
  color: string; // 'blue' や 'red' などのキー
  eye: string;
  brow: string;
  mouth: string;
  isModal?: boolean; // モーダル表示での固定用フラグ
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  color,
  eye,
  brow,
  mouth,
  isModal = false,
}) => {
  // 決定モーダルの中では固定の表情（青、怒り目、怒り眉、スマイル）にするための条件分岐
  const currentColor = isModal ? 'blue' : color;
  const currentEye = isModal ? 'angry' : eye;
  const currentBrow = isModal ? 'angry' : brow;
  const currentMouth = isModal ? 'smile' : mouth;

  return (
    <View style={styles.avatarContainer}>
      {/* 1. 土台の顔画像（色） */}
      {faceImages[currentColor] && (
        <Image source={faceImages[currentColor]} style={styles.partImage} resizeMode="contain" />
      )}

      {/* 2. 眉毛パーツ */}
      {browImages[currentBrow] && (
        <Image source={browImages[currentBrow]} style={styles.partImage} resizeMode="contain" />
      )}

      {/* 3. 目元パーツ */}
      {eyeImages[currentEye] && (
        <Image source={eyeImages[currentEye]} style={styles.partImage} resizeMode="contain" />
      )}

      {/* 4. 口パーツ */}
      {mouthImages[currentMouth] && (
        <Image source={mouthImages[currentMouth]} style={styles.partImage} resizeMode="contain" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 160,           
    height: 160,          
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partImage: {
    position: 'absolute',
    width: '100%',        // 👈 親の160pxに合わせる
    height: '100%',       // 👈 親の160pxに合わせる
    resizeMode: 'contain', // 👈 画像が歪まないようにきれいに収める
  },
});