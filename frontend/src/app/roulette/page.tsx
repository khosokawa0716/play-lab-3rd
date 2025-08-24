'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { RouletteWheel } from '@/components/roulette/RouletteWheel'
import { GameScore } from '@/components/roulette/GameScore'
import { BettingPanel, RouletteBetResult } from '@/components/roulette/BettingPanel'
import { GAME_CONFIG } from '@/constants/gameConfig'
import { useAuth } from '@/contexts/AuthContext'
import { gameApi } from '@/lib/gameApi'

const GAME_TYPE = 'roulette'
type Bets = { [key: number]: number }

function calculateResult(
  result: number,
  bets: Bets,
  score: number,
  payoutMultiplier: number
) {
  const winAmount = bets[result] || 0
  const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0)
  let newScore = score - totalBetAmount
  let netResult = -totalBetAmount
  let totalPayout = 0

  if (winAmount > 0) {
    totalPayout = winAmount * payoutMultiplier
    newScore += totalPayout
    netResult = totalPayout - totalBetAmount
  }

  return { newScore, winAmount, totalBetAmount, netResult, totalPayout }
}

async function saveGameResultIfNeeded({
  isAuthenticated,
  user,
  result,
  bets,
  totalBetAmount,
  winAmount,
  payoutMultiplier,
  netResult,
  consecutiveWins,
  newScore,
}: {
  isAuthenticated: boolean
  user: any
  result: number
  bets: Bets
  totalBetAmount: number
  winAmount: number
  payoutMultiplier: number
  netResult: number
  consecutiveWins: number
  newScore: number
}) {
  if (!isAuthenticated || !user) return

  const gameDetails = {
    result_number: result,
    bets,
    total_bet: totalBetAmount,
    payout: winAmount > 0 ? winAmount * payoutMultiplier : 0,
    net_result: netResult,
    consecutive_wins: consecutiveWins + (netResult > 0 ? 1 : 0),
  }

  try {
    await gameApi.saveGameResult({
      game_type: GAME_TYPE,
      score: newScore,
      details: JSON.stringify(gameDetails),
    })
  } catch (error) {
    console.error('Failed to save game result:', error)
  }
}

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

    const {
      newScore,
      winAmount,
      totalBetAmount,
      netResult,
      totalPayout,
    } = calculateResult(result, bets, score, GAME_CONFIG.PAYOUT_MULTIPLIER)

    setLastWinAmount(netResult)
    setConsecutiveWins(prev => (netResult > 0 ? prev + 1 : 0))
    setScore(newScore)

    setGameResult({
      winningSectionId: result,
      winningAmount: winAmount,
      totalPayout: totalPayout,
    })
    setShowResult(true)
    setIsSpinning(false)

    setTimeout(() => {
      setShowResult(false)
      setGameResult(null)
      setBets({})
    }, 5000)

    await saveGameResultIfNeeded({
      isAuthenticated,
      user,
      result,
      bets,
      totalBetAmount,
      winAmount,
      payoutMultiplier: GAME_CONFIG.PAYOUT_MULTIPLIER,
      netResult,
      consecutiveWins,
      newScore,
    })
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

  // スコア初期化: 認証済みユーザーなら最新スコアを取得
  useEffect(() => {
    if (isAuthenticated && user) {
      gameApi.getUserGameHistory(GAME_TYPE, 1)
        .then(history => {
          if (history.length > 0) {
            setScore(history[0].score)
          }
        })
        .catch(err => {
          // エラー時は初期値のまま
          console.error('最新スコア取得失敗:', err)
        })
    }
  }, [isAuthenticated, user])

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