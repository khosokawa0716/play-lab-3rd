'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="game-title">🎮 プレイラボ！</h1>
        <p className="text-xl text-gray-600 mb-8">
          楽しく学べるゲームセンターへようこそ！
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-game-primary mb-4">🎰 ルーレットゲーム</h2>
            <p className="text-gray-600 mb-4">
              ランダムに変化する図柄を予測して当てる、直感的なタイミングゲーム
            </p>
            <a href="/roulette" className="block">
              <button className="btn-primary w-full">
                ゲームを始める
              </button>
            </a>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold text-game-secondary mb-4">🎁 ログインボーナス</h2>
            <p className="text-gray-600 mb-4">
              毎日ログインして特別な報酬をゲットしよう！
            </p>
            <button className="btn-secondary w-full">
              ボーナスを受け取る
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm mx-auto">
                <p className="text-lg font-semibold text-gray-800">
                  ようこそ、{user.nickname}さん！
                </p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Link href="/profile">
                  <button className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-lg">
                    👤 プロフィール
                  </button>
                </Link>
                <button 
                  onClick={logout}
                  className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors duration-200 text-lg"
                >
                  ログアウト
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Link href="/login">
                <button className="btn-accent mr-4">
                  ログイン
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-white border-2 border-game-accent text-game-accent font-bold py-3 px-6 rounded-lg hover:bg-game-accent hover:text-white transition-colors duration-200 text-lg">
                  新規登録
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}