import { apiClient } from './api'
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth'

export const authApi = {
  // ログイン
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // FastAPIのOAuth2PasswordRequestFormに合わせて、FormDataを使用
    const formData = new FormData()
    formData.append('username', credentials.email) // FastAPIではusernameフィールドにemailを入れる
    formData.append('password', credentials.password)

    const response = await apiClient.post('/api/v1/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // ユーザー登録
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/v1/auth/register', credentials)
    return response.data
  },

  // 現在のユーザー情報を取得（トークン有効性確認用）
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/v1/auth/me')
    return response.data
  },
}