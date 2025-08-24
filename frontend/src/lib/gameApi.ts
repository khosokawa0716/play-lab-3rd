import { apiClient } from './api'

interface GameResultPayload {
  game_type: string
  score: number
  details?: string
}

export interface GameScore {
  id: number
  user_id: number
  game_type: string
  score: number
  details?: string
  played_at: string
}

export interface UserGameStats {
  total_games: number
  total_score: number
  best_score: number
  average_score: number
  recent_games: GameScore[]
}

export const gameApi = {
  // ゲーム結果を保存
  saveGameResult: async (gameResult: GameResultPayload): Promise<GameScore> => {
    const response = await apiClient.post('/api/v1/games/scores', gameResult)
    return response.data
  },

  // ユーザーのゲーム統計を取得
  getUserGameStats: async (gameType?: string): Promise<UserGameStats> => {
    const params = gameType ? { game_type: gameType } : {}
    const response = await apiClient.get('/api/v1/games/stats', { params })
    return response.data
  },

  // ユーザーのゲーム履歴を取得
  getUserGameHistory: async (gameType?: string, limit = 10): Promise<GameScore[]> => {
    const params = { 
      ...(gameType && { game_type: gameType }),
      limit 
    }
    const response = await apiClient.get('/api/v1/games/history', { params })
    return response.data
  },
}