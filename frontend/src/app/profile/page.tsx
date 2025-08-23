'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { gameApi, UserGameStats } from '@/lib/gameApi'

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [gameStats, setGameStats] = useState<UserGameStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated && user) {
      loadGameStats()
    }
  }, [isAuthenticated, user])

  const loadGameStats = async () => {
    try {
      setStatsLoading(true)
      const stats = await gameApi.getUserGameStats('roulette')
      setGameStats(stats)
    } catch (err: any) {
      console.error('Failed to load game stats:', err)
      setError('ゲーム統計の読み込みに失敗しました')
    } finally {
      setStatsLoading(false)
    }
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  // 未認証ユーザー向けの表示
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">プロフィール</h2>
          <p className="text-gray-600 mb-6">
            プロフィールを表示するにはログインが必要です。
          </p>
          <div className="space-y-3">
            <Link href="/login" className="block">
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                ログイン
              </button>
            </Link>
            <Link href="/" className="block">
              <button className="w-full bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors">
                ホームに戻る
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* ヘッダー */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                👤 プロフィール
              </h1>
              <div className="text-gray-600">
                <p className="text-lg font-semibold">{user?.nickname}</p>
                <p className="text-sm">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  登録日: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/roulette">
                <button className="block w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  🎰 ルーレットゲーム
                </button>
              </Link>
              <button 
                onClick={logout}
                className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>

        {/* ゲーム統計 */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎰 ルーレットゲーム統計</h2>
          
          {statsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">統計を読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={loadGameStats}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                再読み込み
              </button>
            </div>
          ) : gameStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{gameStats.total_games}</div>
                <div className="text-sm text-gray-600">プレイ回数</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{gameStats.best_score}</div>
                <div className="text-sm text-gray-600">最高スコア</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{gameStats.total_score}</div>
                <div className="text-sm text-gray-600">総合スコア</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {gameStats.average_score.toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">平均スコア</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎰</div>
              <p className="text-gray-600 mb-4">まだゲームをプレイしていません</p>
              <Link href="/roulette">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  ルーレットゲームを始める
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* 最近のゲーム履歴 */}
        {gameStats && gameStats.recent_games && gameStats.recent_games.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 最近のゲーム履歴</h3>
            <div className="space-y-3">
              {gameStats.recent_games.map((game, index) => (
                <div key={game.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">スコア: {game.score}</span>
                    {game.details && (
                      <span className="text-sm text-gray-600 ml-2">
                        {(() => {
                          try {
                            const details = JSON.parse(game.details)
                            return `(${details.net_result > 0 ? '+' : ''}${details.net_result}pt)`
                          } catch {
                            return ''
                          }
                        })()}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(game.played_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フッター */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-white hover:text-gray-200 transition-colors">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}