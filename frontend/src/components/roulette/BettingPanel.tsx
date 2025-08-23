'use client'

import { useState } from 'react'

import { GAME_CONFIG, WheelSection } from '@/constants/gameConfig'

interface BettingPanelProps {
  sections: readonly WheelSection[]
  bets: { [key: number]: number }
  onBetChange: (sectionId: number, amount: number) => void
  totalScore: number
  isDisabled: boolean
}

const BET_AMOUNTS = GAME_CONFIG.BET_AMOUNTS

export function BettingPanel({ sections, bets, onBetChange, totalScore, isDisabled }: BettingPanelProps) {
  const [selectedBetAmount, setSelectedBetAmount] = useState(GAME_CONFIG.BET_AMOUNTS[1])

  const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet, 0)

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
          return (
            <button
              key={section.id}
              onClick={() => handleBetClick(section.id)}
              disabled={isDisabled}
              className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                betAmount > 0
                  ? 'border-yellow-400 bg-yellow-50 shadow-lg scale-105'
                  : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
              } ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              }`}
              style={{
                background: betAmount > 0 
                  ? `linear-gradient(135deg, ${section.color}22, ${section.color}11)` 
                  : undefined
              }}
            >
              <div className="text-2xl mb-1">{section.emoji}</div>
              <div className="text-xs font-bold text-gray-800">{section.label}</div>
              {betAmount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {betAmount}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={handleClearBets}
          disabled={isDisabled || totalBetAmount === 0}
          className={`px-4 py-1 text-sm rounded-lg font-bold transition-all ${
            isDisabled || totalBetAmount === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105'
          }`}
        >
          🗑️ クリア
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