import React from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';

// --- イラスト素材（画像パス）の辞書定義 ---
export const faceImages: { [key: string]: any } = {
  blue: require('../assets/avatar/faces/blue.png'),
  red: require('../assets/avatar/faces/red.png'),
  yellow: require('../assets/avatar/faces/yellow.png'),
  green: require('../assets/avatar/faces/green.png'),
  purple: require('../assets/avatar/faces/purple.png'),
  pink: require('../assets/avatar/faces/pink.png'),
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
  droopy: require('../assets/avatar/brows/brows4.png'),
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
  color: string;
  eye: string;
  brow: string;
  mouth: string;
  isModal?: boolean;
  size?: number; // 💡 呼び出し元でサイズを変更できるよう追加（デフォルト160）
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({
  color,
  eye,
  brow,
  mouth,
  isModal = false,
  size = 160,
}) => {
  const currentColor = isModal ? 'blue' : color;
  const currentEye = isModal ? 'angry' : eye;
  const currentBrow = isModal ? 'angry' : brow;
  const currentMouth = isModal ? 'smile' : mouth;

  return (
    // 💡 影と全体のサイズを管理する外枠
    <View style={[styles.shadowWrapper, { width: size, height: size }]}>
      {/* 💡 白いフチ（白枠）を作るための外側の円 */}
      <View style={[styles.whiteBorderCircle, { borderRadius: size / 2 }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  // 💡 白枠の外側に落ちる影（ドロップシャドウ）
  shadowWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5, // Android用
  },
  // 💡 画像の周りを囲む太い「白フチ」
  whiteBorderCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF', // 💡 下地を白にして白線を作る
    borderWidth: 3,             // 💡 白線の太さ（お好みで 5〜8 付近に調整可）
    borderColor: '#FFFFFF',     // 💡 白色の枠線
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',         // はみ出た部分を丸くカット
  },
  partImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});