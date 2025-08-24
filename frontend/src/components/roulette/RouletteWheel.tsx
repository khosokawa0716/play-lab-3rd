'use client'

import { useState, useEffect, useRef } from 'react'
import { GAME_CONFIG } from '@/constants/gameConfig'

interface RouletteWheelProps {
  isSpinning: boolean
  onResult: (result: number) => void
  onSpin: () => void
  totalBetAmount: number
}

export function RouletteWheel({ isSpinning, onResult, onSpin, totalBetAmount }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [showWinAnimation, setShowWinAnimation] = useState(false)
  const spinIdRef = useRef<number>(0)
  const hasResultBeenCalled = useRef<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (isSpinning && !hasResultBeenCalled.current) {
      setShowWinAnimation(false)
      setSelectedSection(null)
      hasResultBeenCalled.current = true
      
      const currentSpinId = ++spinIdRef.current
      const spinAmount = 360 * GAME_CONFIG.SPIN_ROTATIONS + Math.random() * 360
      let finalRotation = 0
      
      // setRotationを関数型で更新し、finalRotationを取得
      setRotation(prev => {
        finalRotation = prev + spinAmount
        return finalRotation
      })
      
      // タイマーを設定
      timeoutRef.current = setTimeout(() => {
        if (currentSpinId === spinIdRef.current) {
          const normalizedRotation = finalRotation % 360
          const sectionAngle = 360 / GAME_CONFIG.WHEEL_SECTIONS.length
          const selectedIndex = Math.floor((360 - normalizedRotation + sectionAngle / 2) / sectionAngle) % GAME_CONFIG.WHEEL_SECTIONS.length
          const selected = GAME_CONFIG.WHEEL_SECTIONS[selectedIndex].id
          
          setSelectedSection(selected)
          
          setTimeout(() => {
            setShowWinAnimation(true)
          }, GAME_CONFIG.ANIMATION_DELAY)
          
          onResult(selected)
        }
        timeoutRef.current = null
      }, GAME_CONFIG.SPIN_DURATION)
      
    } else if (!isSpinning) {
      // スピンが終了したらフラグをリセット
      hasResultBeenCalled.current = false
    }
    
    // クリーンアップ関数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isSpinning])

  const sectionAngle = 360 / GAME_CONFIG.WHEEL_SECTIONS.length

  return (
    <div className="relative">
      <div className="relative w-80 h-80 mx-auto overflow-hidden rounded-full">
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '160px 160px',
            transition: isSpinning 
              ? `transform ${GAME_CONFIG.SPIN_DURATION}ms cubic-bezier(0.15, 0.75, 0.35, 1)`
              : 'none'
          }}
        >
          {GAME_CONFIG.WHEEL_SECTIONS.map((section, index) => {
            const startAngle = (index * sectionAngle - 90) * (Math.PI / 180)
            const endAngle = ((index + 1) * sectionAngle - 90) * (Math.PI / 180)
            const midAngle = (startAngle + endAngle) / 2
            
            const x1 = 160 + Math.cos(startAngle) * 140
            const y1 = 160 + Math.sin(startAngle) * 140
            const x2 = 160 + Math.cos(endAngle) * 140
            const y2 = 160 + Math.sin(endAngle) * 140
            
            const textX = 160 + Math.cos(midAngle) * 100
            const textY = 160 + Math.sin(midAngle) * 100
            
            const largeArc = sectionAngle > 180 ? 1 : 0

            return (
              <g key={section.id}>
                <path
                  d={`M 160 160 L ${x1} ${y1} A 140 140 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={section.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className={`${
                    selectedSection === section.id && showWinAnimation ? 'animate-pulse drop-shadow-2xl' : ''
                  }`}
                  style={{
                    filter: selectedSection === section.id && showWinAnimation 
                      ? 'brightness(2.2) saturate(1.8) drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))' 
                      : undefined
                  }}
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white font-bold text-2xl"
                >
                  {section.emoji}
                </text>
              </g>
            )
          })}
          
          <circle
            cx="160"
            cy="160"
            r="20"
            fill="#ffffff"
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-10">
          <div className="relative">
            <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-red-500 drop-shadow-2xl animate-pulse"></div>
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-red-500 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={onSpin}
          disabled={isSpinning || totalBetAmount === 0}
          className={`btn-primary text-2xl py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-200 ${
            isSpinning || totalBetAmount === 0
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-105 active:scale-95'
          }`}
        >
          {isSpinning ? '🎯 回転中...' : '🎯 スピン！'}
        </button>
      </div>
      
    </div>
  )
}