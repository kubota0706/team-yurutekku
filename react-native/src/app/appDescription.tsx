import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';

// 画面のサイズを取得
const { width, height } = Dimensions.get('window');

export default function App() {
  const [activePage, setActivePage] = useState(0);
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
        onPageScroll={(event) => setActivePage(Math.round(event.nativeEvent.position + event.nativeEvent.offset))}
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

      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activePage ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  dotContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  inactiveDot: {
    backgroundColor: '#fff',
    opacity: 0.75,
  },
});