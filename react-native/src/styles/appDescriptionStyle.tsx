import { StyleSheet} from 'react-native';

export const descriptionStyles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#FFDD48', 
  },
  pagerView: {
    flex: 1,
  },
  page: {
    // 画面サイズは呼び出し元からpropsで受け取り、ここではサイズのみ設定しない
    // width: width,
    // height: height,
    // 画像を中央に配置
    justifyContent: 'center',
    alignItems: 'center',
    // 念のため、このビュー自体のマージンやパディングを0に
    margin: 0,
    padding: 0,
  },
  image: {
    // ★親のサイズいっぱいにする
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    position: 'absolute',
    bottom: 32,
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
  startButtonWrapper: {
    position: 'absolute',
    bottom: 95,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: '#333',
  },
  inactiveDot: {
    backgroundColor: '#fff',
    opacity: 0.75,
  },
});