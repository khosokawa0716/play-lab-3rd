'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { RouletteWheel } from '@/components/roulette/RouletteWheel'
import { GameScore } from '@/components/roulette/GameScore'
import { BettingPanel, RouletteBetResult } from '@/components/roulette/BettingPanel'
import { GAME_CONFIG } from '@/constants/gameConfig'
import { useAuth } from '@/contexts/AuthContext'
import { gameApi } from '@/lib/gameApi'

type Bets = { [key: number]: number }

export default function RoulettePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [score, setScore] = useState<number>(GAME_CONFIG.INITIAL_SCORE)
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastResult, setLastResult] = useState<number | null>(null)
  const [bets, setBets] = useState<Bets>({})
  const [consecutiveWins, setConsecutiveWins] = useState(0)
  const [lastWinAmount, setLastWinAmount] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameResult, setGameResult] = useState<RouletteBetResult | null>(null)

  const handleResult = useCallback(async (result: number) => {
    setLastResult(result)
    
    let newScore = score
    const winAmount = bets[result] || 0
    const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0)
    
    newScore -= totalBetAmount
    
    let netResult = 0
    let totalPayout = 0
    if (winAmount > 0) {
      const payout = winAmount * GAME_CONFIG.PAYOUT_MULTIPLIER
      newScore += payout
      netResult = payout - totalBetAmount
      totalPayout = payout
    } else {
      netResult = -totalBetAmount
    }
    
    setLastWinAmount(netResult)
    
    if (netResult > 0) {
      setConsecutiveWins(prev => prev + 1)
    } else {
      setConsecutiveWins(0)
    }
    
    setScore(newScore)
    
    // 結果表示の設定
    setGameResult({
      winningSectionId: result,
      winningAmount: winAmount,
      totalPayout: totalPayout
    })
    setShowResult(true)
    setIsSpinning(false)
    
    // 5秒後に結果表示を終了し、ベットをクリア
    setTimeout(() => {
      setShowResult(false)
      setGameResult(null)
      setBets({})
    }, 5000)

    // ログインユーザーの場合、ゲーム結果をサーバーに保存
    if (isAuthenticated && user) {
      try {
        const gameDetails = {
          result_number: result,
          bets: bets,
          total_bet: totalBetAmount,
          payout: winAmount > 0 ? winAmount * GAME_CONFIG.PAYOUT_MULTIPLIER : 0,
          net_result: netResult,
          consecutive_wins: consecutiveWins + (netResult > 0 ? 1 : 0),
        }

        await gameApi.saveGameResult({
          game_type: 'roulette',
          score: newScore,
          details: JSON.stringify(gameDetails),
        })
      } catch (error) {
        console.error('Failed to save game result:', error)
        // エラーが発生してもゲームは続行
      }
    }
  }, [score, bets, consecutiveWins, isAuthenticated, user])

  const handleSpin = () => {
    const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0)
    if (totalBetAmount === 0) {
      alert('ベットしてからスピンしてください！')
      return
    }
    if (totalBetAmount > score) {
      alert('ベット額が所持ポイントを超えています！')
      return
    }
    setIsSpinning(true)
    setLastResult(null)
  }

  const updateBet = (sectionId: number, amount: number) => {
    setBets(prev => ({
      ...prev,
      [sectionId]: amount
    }))
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
          <div className="text-6xl mb-4">🎰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ルーレットゲーム</h2>
          <p className="text-gray-600 mb-6">
            ゲームをプレイするにはログインが必要です。<br />
            ログインするとスコアが保存され、統計を確認できます！
          </p>
          <div className="space-y-3">
            <Link href="/login" className="block">
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                ログイン
              </button>
            </Link>
            <Link href="/register" className="block">
              <button className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                新規登録
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-2">
      <div className="container mx-auto max-w-6xl">
        <GameScore 
          score={score} 
          lastResult={lastResult} 
          consecutiveWins={consecutiveWins}
          lastWinAmount={lastWinAmount}
        />
        
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <div className="flex justify-center">
            <RouletteWheel 
              isSpinning={isSpinning}
              onResult={handleResult}
              onSpin={handleSpin}
              totalBetAmount={Object.values(bets).reduce((sum, bet) => sum + bet, 0)}
            />
          </div>

          <div>
            <BettingPanel
              sections={GAME_CONFIG.WHEEL_SECTIONS}
              bets={bets}
              onBetChange={updateBet}
              totalScore={score}
              isDisabled={isSpinning}
              gameResult={gameResult}
              showResult={showResult}
            />
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          <div className="flex justify-center space-x-4">
            <a href="/">
              <button className="bg-white text-game-primary font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                ← ホームに戻る
              </button>
            </a>
            <button className="bg-white text-game-secondary font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              ルールを見る
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}