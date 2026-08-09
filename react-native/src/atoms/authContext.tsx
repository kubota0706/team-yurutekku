// src/atoms/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

type AuthContextType = ReturnType<typeof useAuth>

const AuthContext = createContext<AuthContextType | null>(null)

// アプリ全体を囲むプロバイダー
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authState = useAuth()
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

// 各画面からユーザー情報を呼び出すための Hook
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}