import { useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Crypto from 'expo-crypto'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth'
import { auth } from '@/dao/firebaseConfig'
import { getLatestProfileVersion } from '@/dao/firebaseGet'

WebBrowser.maybeCompleteAuthSession()

// Uint8Array を Buffer なしで Base64URL に変換する関数
const bytesToBase64Url = (bytes: Uint8Array): string => {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Base64 文字列を Base64URL に変換する関数
const toBase64Url = (base64: string) =>
  base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [userVersion, setUserVersion] = useState<number | null>(null)
  const [initializing, setInitializing] = useState<boolean>(true)
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false)

  // Firebase の認証状態 & user-meta バージョンの監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          // Firebase Auth ユーザーが存在する場合、user-meta のバージョンを取得
          const version = await getLatestProfileVersion(currentUser.uid)
          setUserVersion(version)
        } catch (error) {
          console.error('Failed to fetch profile version:', error)
          setUserVersion(null)
        }
      } else {
        setUserVersion(null)
      }

      // Auth ＆ Firestore 判定が完了したら初期化終了
      setInitializing(false)
    })

    return () => unsubscribe()
  }, [])

  // Google ログイン実行関数
  const signInWithGoogle = useCallback(async () => {
    if (isSigningIn) return
    setIsSigningIn(true)

    try {
      const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
      if (!iosClientId) {
        throw new Error('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID が設定されていません')
      }

      const reversedClientId = iosClientId.split('.').reverse().join('.')

      // 1. PKCE 用の codeVerifier と codeChallenge を生成
      const randomBytes = await Crypto.getRandomBytesAsync(32)
      const codeVerifier = bytesToBase64Url(randomBytes)

      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        codeVerifier,
        { encoding: Crypto.CryptoEncoding.BASE64 }
      )
      const codeChallenge = toBase64Url(digest)

      // 2. リダイレクト URI の指定
      const redirectUri = `${reversedClientId}:/oauthredirect`

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${iosClientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('openid profile email')}` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256` +
        `&prompt=select_account`

      // 3. 認証セッションを起動
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri)

      if (result.type === 'success' && result.url) {
        const match = result.url.match(/[?&]code=([^&]+)/)
        const code = match ? decodeURIComponent(match[1]) : null

        if (!code) {
          throw new Error('認証コードの取得に失敗しました')
        }

        // 4. Authorization Code から Token へ交換
        const tokenResponse = await fetch(
          'https://oauth2.googleapis.com/token',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: iosClientId,
              code,
              code_verifier: codeVerifier,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri,
            }).toString(),
          }
        )

        const tokens = await tokenResponse.json()

        if (!tokenResponse.ok) {
          throw new Error(tokens.error_description || 'トークン交換に失敗しました')
        }

        // 5. Firebase へのサインイン
        if (tokens.id_token) {
          const credential = GoogleAuthProvider.credential(tokens.id_token)
          await signInWithCredential(auth, credential)
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error)
      Alert.alert('ログインエラー', error.message || 'ログイン処理に失敗しました')
    } finally {
      setIsSigningIn(false)
    }
  }, [isSigningIn])

  // サインアウト
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth)
      setUserVersion(null)
    } catch (error: any) {
      console.error('Sign-Out Error:', error)
      Alert.alert('ログアウトエラー', error.message)
    }
  }, [])

  return {
    user,
    userVersion,
    isRegistered: userVersion !== null, // バージョンが存在していれば登録済みフラグを true に
    initializing,
    isSigningIn,
    signInWithGoogle,
    promptAsync: signInWithGoogle,
    signOut,
  }
}