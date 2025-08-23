export interface User {
  id: number
  email: string
  nickname: string
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  nickname: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
}