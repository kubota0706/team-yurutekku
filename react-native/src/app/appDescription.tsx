import React from 'react';
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';

// 画面のサイズを取得
const { width, height } = Dimensions.get('window');

export default function App() {
  // 表示したい画像のリスト（ローカル画像またはURL）
  const images = [
    require('@/assets/アプリの説明.png'),
    require('@/assets/アプリ説明2.png'), // 画像パスは環境に合わせて変更してください
    require('@/assets/アプリ説明3.png'),
  ];

 return (
    <View style={styles.container}>
      {/* <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> */}
      
      <PagerView 
        style={styles.pagerView} 
        initialPage={0}
        // ページ間の隙間を0にする（ScrollViewの場合は不要）
        pageMargin={0} 
      >
        {images.map((source, index) => (
          // 各スライドのコンテナ。画面サイズぴったりにする。
          <View style={styles.page} key={index}>
            <Image 
              source={source} 
              style={styles.image} 
              contentFit='contain'
              transition={200}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 隙間が見えるか確認するために、あえて目立つ色（赤など）にしても良い
    // 最終的には黒でOK
    backgroundColor: '#FFDD48', 
  },
  pagerView: {
    flex: 1,
  },
  page: {
    // ★画面サイズと同じサイズに設定
    width: width,
    height: height,
    // 画像を中央に配置（coverなら通常不要だが念のため）
    justifyContent: 'center',
    alignItems: 'center',
    // 念のため、このビュー自体のマージンやパディングを0に
    margin: 0,
    padding: 0,
  },
  image: {
    // ★親（page）のサイズいっぱいにする
    width: '100%',
    height: '100%',
  },
});