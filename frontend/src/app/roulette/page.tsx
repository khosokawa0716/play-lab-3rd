'use client'

import { useState } from 'react'
import { RouletteWheel } from '@/components/roulette/RouletteWheel'
import { GameScore } from '@/components/roulette/GameScore'
import { BettingPanel } from '@/components/roulette/BettingPanel'

const WHEEL_SECTIONS = [
  { id: 1, color: '#ef4444', emoji: '🍎', label: 'りんご' },
  { id: 2, color: '#f59e0b', emoji: '🍌', label: 'バナナ' },
  { id: 3, color: '#10b981', emoji: '🍇', label: 'ぶどう' },
  { id: 4, color: '#3b82f6', emoji: '🍓', label: 'いちご' },
  { id: 5, color: '#8b5cf6', emoji: '🍑', label: 'さくらんぼ' },
  { id: 6, color: '#f97316', emoji: '🥕', label: 'にんじん' },
  { id: 7, color: '#06b6d4', emoji: '🐟', label: 'さかな' },
  { id: 8, color: '#84cc16', emoji: '⭐', label: 'スター' }
]

type Bets = { [key: number]: number }

export default function RoulettePage() {
  const [score, setScore] = useState(1000)
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastResult, setLastResult] = useState<number | null>(null)
  const [bets, setBets] = useState<Bets>({})
  const [consecutiveWins, setConsecutiveWins] = useState(0)
  const [lastWinAmount, setLastWinAmount] = useState(0)

  const handleResult = (result: number, isWin: boolean) => {
    setLastResult(result)
    
    let newScore = score
    const winAmount = bets[result] || 0
    const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0)
    
    newScore -= totalBetAmount
    
    let netResult = 0
    if (winAmount > 0) {
      const payout = winAmount * 5
      newScore += payout
      netResult = payout - totalBetAmount
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
    setBets({})
    setIsSpinning(false)
  }

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
              sections={WHEEL_SECTIONS}
              bets={bets}
              onBetChange={updateBet}
              totalScore={score}
              isDisabled={isSpinning}
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