export interface User {
  id: number
  email: string
  nickname: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

export interface GameScore {
  id: number
  user_id: number
  game_type: string
  score: number
  played_at: string
}

export interface RouletteGameData {
  symbols: string[]
  currentSymbol: string
  isSpinning: boolean
  bet: {
    type: 'color' | 'symbol'
    value: string
    amount: number
  } | null
  result: {
    won: boolean
    winAmount: number
  } | null
}