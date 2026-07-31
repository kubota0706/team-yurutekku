import React from 'react';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { styles, tabBarScreenOptions } from '@/styles/tabNavigatorStyles';

// タブアイコンコンポーネント
const TabIcon = ({
  source,
  focused,
}: {
  source: any;
  focused: boolean;
}) => (
  <Image
    source={source}
    style={[
      styles.tabIcon,
      { opacity: focused ? 1 : 0.3 },
    ]}
    resizeMode="contain"
  />
);

export default function HomeLayout() {
  return (
    <Tabs screenOptions={tabBarScreenOptions as any}>
      {/* タブ1: ホーム画面 */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム画面',
          headerTitle: 'ホーム画面',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/navi/ホーム画面.png')}
              focused={focused}
            />
          ),
        }}
      />

      {/* タブ2: おもいで */}
      <Tabs.Screen
        name="memory"
        options={{
          title: 'おもいで',
          headerTitle: 'おもいで',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/navi/おもいで.png')}
              focused={focused}
            />
          ),
        }}
      />

      {/* タブ3: ともだち */}
      <Tabs.Screen
        name="friend"
        options={{
          title: 'ともだち',
          headerTitle: 'ともだち',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/navi/友達.png')}
              focused={focused}
            />
          ),
        }}
      />

      {/* タブ4: 交換 */}
      <Tabs.Screen
        name="exchange"
        options={{
          title: '交換',
          headerTitle: '交換',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/navi/交換.png')}
              focused={focused}
            />
          ),
        }}
      />

      {/* タブ5: プロフィール */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'プロフィール',
          headerTitle: 'プロフィール',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require('@/assets/navi/プロフィール.png')}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="editProfile" 
        options={{
          title: 'プロフィール編集',
          href: null,
        }}
      />
    </Tabs>
  );
}
