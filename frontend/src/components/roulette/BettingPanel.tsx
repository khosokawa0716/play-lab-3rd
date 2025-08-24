'use client'

import { useState, useEffect } from 'react'

import { GAME_CONFIG, WheelSection } from '@/constants/gameConfig'

export interface RouletteBetResult {
  winningSectionId: number
  winningAmount: number
  totalPayout: number
}

interface BettingPanelProps {
  sections: readonly WheelSection[]
  bets: { [key: number]: number }
  onBetChange: (sectionId: number, amount: number) => void
  totalScore: number
  isDisabled: boolean
  gameResult: RouletteBetResult | null
  showResult?: boolean
}

const BET_AMOUNTS = GAME_CONFIG.BET_AMOUNTS

export function BettingPanel({ sections, bets, onBetChange, totalScore, isDisabled, gameResult, showResult }: BettingPanelProps) {
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(GAME_CONFIG.BET_AMOUNTS[1])

  useEffect(() => {
    if (showResult && gameResult) {
      const timer = setTimeout(() => {
        sections.forEach(section => {
          onBetChange(section.id, 0)
        })
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [showResult, gameResult, sections, onBetChange])

  const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0)

  const getBetStatus = (sectionId: number): 'winning' | 'losing' | 'none' => {
    if (!showResult || !gameResult) return 'none'
    const betAmount = bets[sectionId] || 0
    if (betAmount === 0) return 'none'
    return sectionId === gameResult.winningSectionId ? 'winning' : 'losing'
  }

  const getWinningSection = () => {
    if (!gameResult) return null
    return sections.find(section => section.id === gameResult.winningSectionId)
  }

  const handleBetClick = (sectionId: number) => {
    if (isDisabled) return
    
    const currentBet = bets[sectionId] || 0
    const newBetAmount = currentBet + selectedBetAmount
    
    if (totalBetAmount - currentBet + newBetAmount > totalScore) {
      alert('ベット額が所持ポイントを超えています！')
      return
    }
    
    onBetChange(sectionId, newBetAmount)
  }

  const handleClearBets = () => {
    if (isDisabled) return
    sections.forEach(section => {
      onBetChange(section.id, 0)
    })
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 mb-3">💰 ベット選択</h3>
      
      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          所持: <span className="text-blue-600">{totalScore}pt</span> | 
          ベット: <span className="text-red-600">{totalBetAmount}pt</span>
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">ベット額:</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {BET_AMOUNTS.map(amount => (
            <button
              key={amount}
              onClick={() => setSelectedBetAmount(amount)}
              disabled={isDisabled}
              className={`px-3 py-1 text-sm rounded-lg font-bold transition-all ${
                selectedBetAmount === amount
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {amount}pt
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {sections.map(section => {
          const betAmount = bets[section.id] || 0
          const betStatus = getBetStatus(section.id)
          const isWinningSection = showResult && gameResult && section.id === gameResult.winningSectionId
          
          let borderClass = 'border-gray-300'
          let bgClass = 'bg-white'
          let shadowClass = ''
          
          if (isWinningSection) {
            borderClass = 'border-yellow-400 animate-pulse'
            bgClass = 'bg-gradient-to-br from-yellow-100 to-yellow-200'
            shadowClass = 'shadow-xl shadow-yellow-300/50'
          } else if (betStatus === 'winning') {
            borderClass = 'border-green-500'
            bgClass = 'bg-green-50'
            shadowClass = 'shadow-lg shadow-green-200/50'
          } else if (betStatus === 'losing') {
            borderClass = 'border-red-400'
            bgClass = 'bg-red-50 opacity-70'
          } else if (betAmount > 0) {
            borderClass = 'border-blue-400'
            bgClass = 'bg-blue-50'
            shadowClass = 'shadow-lg'
          }

          return (
            <button
              key={section.id}
              onClick={() => handleBetClick(section.id)}
              disabled={isDisabled}
              className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${borderClass} ${bgClass} ${shadowClass} ${
                isDisabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              } ${isWinningSection ? 'scale-110' : betAmount > 0 ? 'scale-105' : ''}`}
            >
              <div className="text-2xl mb-1">{section.emoji}</div>
              <div className="text-xs font-bold text-gray-800">{section.label}</div>
              
              {betAmount > 0 && (
                <div className={`absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                  betStatus === 'winning' ? 'bg-green-500' :
                  betStatus === 'losing' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}>
                  {betAmount}
                </div>
              )}
              
              {betStatus === 'winning' && (
                <div className="absolute -top-2 -left-2 text-green-500 text-lg animate-bounce">
                  ✅
                </div>
              )}
              
              {isWinningSection && (
                <div className="absolute inset-0 rounded-xl bg-yellow-400/20 animate-pulse"></div>
              )}
            </button>
          )
        })}
      </div>

      {showResult && gameResult && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 shadow-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-800 mb-2">
              🎯 結果: {getWinningSection()?.emoji} {getWinningSection()?.label}
            </div>
            {gameResult.winningAmount > 0 ? (
              <div className="space-y-1">
                <div className="text-sm text-green-700 font-semibold">
                  💰 的中ベット: {gameResult.winningAmount}pt → {gameResult.winningAmount * GAME_CONFIG.PAYOUT_MULTIPLIER}pt獲得
                </div>
                <div className="text-base text-green-800 font-bold">
                  📊 総獲得: {gameResult.totalPayout}pt
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                😢 今回は外れでした。次回頑張りましょう！
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-center">
        <button
          onClick={handleClearBets}
          disabled={isDisabled || totalBetAmount === 0 || showResult}
          className={`px-4 py-1 text-sm rounded-lg font-bold transition-all ${
            isDisabled || totalBetAmount === 0 || showResult
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
          }`}
        >
          🗑️ {showResult ? '結果表示中...' : 'クリア'}
        </button>
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 図柄をクリックしてベット。的中すると{GAME_CONFIG.PAYOUT_MULTIPLIER}倍！
        </p>
      </div>
    </div>
  )
}