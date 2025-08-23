'use client'

interface GameScoreProps {
  score: number
  lastResult?: number | null
  consecutiveWins: number
  lastWinAmount: number
}

export function GameScore({ score, lastResult, consecutiveWins, lastWinAmount }: GameScoreProps) {
  return (
    <div className="flex justify-center space-x-6 mb-8">
      <div className="bg-white rounded-xl px-6 py-4 shadow-lg border-2 border-yellow-300">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">スコア</div>
          <div className="text-3xl font-bold text-game-accent">{score}</div>
        </div>
      </div>
      
      {lastResult && (
        <div className={`bg-white rounded-xl px-6 py-4 shadow-lg border-2 animate-bounce-slow ${
          lastWinAmount > 0 ? 'border-green-300' : 'border-red-300'
        }`}>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-1">前回の結果</div>
            <div className={`text-2xl font-bold ${
              lastWinAmount > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {lastWinAmount > 0 ? '+' : ''}{lastWinAmount} pt
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl px-6 py-4 shadow-lg border-2 border-blue-300">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">連続成功</div>
          <div className="text-3xl font-bold text-game-primary">{consecutiveWins}</div>
        </div>
      </div>
    </div>
  )
}