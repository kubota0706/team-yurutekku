import { StyleSheet } from 'react-native';

// タブアイコンのサイズ（共通変数）
export const TAB_ICON_SIZE = 60;

export const styles = StyleSheet.create({
  tabIcon: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
  },
  tabIconFocused: {
    opacity: 1,
  },
  tabIconUnfocused: {
    opacity: 0.6,
  },
  tabBarContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 8,
    paddingTop: 25,
    height: 100,
  },
});

// タブバーの画面オプション
export const tabBarScreenOptions = {
  tabBarPosition: 'bottom' as const,
  tabBarStyle: styles.tabBarContainer,
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600' as const,
    marginTop: 4,
    display: 'none' as any,
  },
  tabBarShowLabel: false,
  tabBarActiveTintColor: '#333333',
  tabBarInactiveTintColor: '#999999',
  headerShown: false,
};
