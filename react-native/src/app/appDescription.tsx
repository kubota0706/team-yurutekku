import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';
import { ActionButtons } from '@/components/ActionButtons';
import { descriptionStyles as styles } from '@/styles/appDescriptionStyle';

const { width: defaultWidth, height: defaultHeight } = Dimensions.get('window');

type AppDescriptionProps = {
  width?: number;
  height?: number;
};

export default function App({
  width = defaultWidth,
  height = defaultHeight,
}: AppDescriptionProps) {
  const [activePage, setActivePage] = useState(0);
  // 表示したい画像のリスト（ローカル画像またはURL）
  const images = [
    require('@/assets/アプリの説明.png'),
    require('@/assets/アプリ説明2.png'),
    require('@/assets/アプリ説明3.png'),
  ];

  const router = useRouter();
  const handleStart = () => {
    router.push('/preferenceRegister');
  };

 return (
    <View style={styles.container}>
      {/* <StatusBar translucent backgroundColor="transparent" barStyle="light-content" /> */}
      
      <PagerView 
        style={styles.pagerView} 
        initialPage={0}
        onPageScroll={(event) => setActivePage(Math.round(event.nativeEvent.position + event.nativeEvent.offset))}
        // ページ間の隙間を0にする
        pageMargin={0} 
      >
        {images.map((source, index) => (
          // 各スライドのコンテナ。画面サイズぴったりにする。
          <View style={[styles.page, { width, height }]} key={index}>
            <Image 
              source={source} 
              style={styles.image} 
              contentFit='contain'
              transition={200}
            />
          </View>
        ))}
      </PagerView>

      {activePage === images.length - 1 && (
        <View style={styles.startButtonWrapper}>
          <ActionButtons onNext={handleStart} nextLabel="はじめる" centered />
        </View>
      )}

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