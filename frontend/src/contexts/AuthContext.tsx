'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/auth'
import { authApi } from '@/lib/authApi'
import { setAuthToken } from '@/lib/api'

// AuthContextの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ローカルストレージ操作（サーバーサイドレンダリング対応）
const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, value)
}

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

// AuthProviderコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // ログイン処理
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await authApi.login(credentials)
      
      // トークンとユーザー情報を保存
      setStorageItem('auth_token', response.access_token)
      setStorageItem('auth_user', JSON.stringify(response.user))
      
      // Axiosヘッダーにトークンを設定
      setAuthToken(response.access_token)
      
      // 状態を更新
      setAuthState({
        user: response.user,
        token: response.access_token,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // ユーザー登録処理
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      const response = await authApi.register(credentials)
      
      // トークンとユーザー情報を保存
      setStorageItem('auth_token', response.access_token)
      setStorageItem('auth_user', JSON.stringify(response.user))
      
      // Axiosヘッダーにトークンを設定
      setAuthToken(response.access_token)
      
      // 状態を更新
      setAuthState({
        user: response.user,
        token: response.access_token,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // ログアウト処理
  const logout = (): void => {
    // ローカルストレージから削除
    removeStorageItem('auth_token')
    removeStorageItem('auth_user')
    
    // Axiosヘッダーからトークンを削除
    setAuthToken(null)
    
    // 状態をリセット
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  // 認証状態の復元（ページリロード時など）
  const refreshAuth = async (): Promise<void> => {
    const token = getStorageItem('auth_token')
    const userStr = getStorageItem('auth_user')
    
    if (!token || !userStr) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return
    }

    try {
      // トークンをAxiosヘッダーに設定
      setAuthToken(token)
      
      // 保存されたユーザー情報を復元
      const user: User = JSON.parse(userStr)
      
      // 必要であれば、サーバーでトークンの有効性を確認
      // TODO: バックエンドに /auth/me エンドポイントを追加後に有効化
      // await authApi.getCurrentUser()
      
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Token validation failed:', error)
      logout() // 無効なトークンの場合はログアウト
    }
  }

  // 初回ロード時に認証状態を復元
  useEffect(() => {
    refreshAuth()
  }, [])

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshAuth,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// AuthContextを使用するためのカスタムフック
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}