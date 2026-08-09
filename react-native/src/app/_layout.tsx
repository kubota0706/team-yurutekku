// src/app/_layout.tsx
import { Slot, Stack, useSegments, useRouter } from 'expo-router'
import { AuthProvider, useAuthContext } from '@/atoms/authContext'
import { useEffect } from 'react'
import { ActivityIndicator ,View } from 'react-native'


const REGISTER_ROUTE = [
    'profiileRegisterBase',
    'appDescription',
    'preferenceRegister',
    'Avatar',
]

function RootLayoutNav() {
  const { user, isRegistered, initializing } = useAuthContext()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    // Auth & Firestore の確認が終わるまでは判定しない
    if (initializing) return

    const currentGroup = segments[0]

    const currentSegment = segments[0]

    if (!user) {
      // ① 未ログイン ➔ ログイン画面へ
      if (currentSegment !== 'login') {
        router.replace('/login')
      }
    } else if (!isRegistered) {
      // ② ログイン済み ＆ ユーザーデータ未登録 ➔ 登録画面へ
      if (currentSegment !== 'profileRegisterBase') {
        if(!REGISTER_ROUTE){
          router.replace('/profileRegisterBase')
        }
      }
    } else {
      // ③ ログイン済み ＆ 登録完了 ➔ メイン画面 (home / tabs 等) へ
      if (currentSegment === 'login' || currentSegment === 'profileRegisterBase') {
        if(currentGroup !== '(home)')
        router.replace('/home') // ご自身のホーム画面パスに調整してください
      }
    }
  }, [user, isRegistered, initializing, segments])

  // 初期化完了まではローディング表示（またはスプラッシュ画面）
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <Stack
        screenOptions={{
            headerShown: false,
        }}
    />
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* <Stack 
        screenOptions={{
            headerShown: false,
        }}
      /> */}
      <RootLayoutNav />
    </AuthProvider>
  )
}