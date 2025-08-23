'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (isSpinning) {
      setShowWinAnimation(false)
      setSelectedSection(null)
      
      const spinAmount = 360 * GAME_CONFIG.SPIN_ROTATIONS + Math.random() * 360
      const finalRotation = rotation + spinAmount
      setRotation(finalRotation)

      setTimeout(() => {
        const normalizedRotation = finalRotation % 360
        const sectionAngle = 360 / GAME_CONFIG.WHEEL_SECTIONS.length
        const selectedIndex = Math.floor((360 - normalizedRotation + sectionAngle / 2) / sectionAngle) % GAME_CONFIG.WHEEL_SECTIONS.length
        const selected = GAME_CONFIG.WHEEL_SECTIONS[selectedIndex].id
        
        setSelectedSection(selected)
        
        setTimeout(() => {
          setShowWinAnimation(true)
        }, GAME_CONFIG.ANIMATION_DELAY)
        
        onResult(selected)
      }, GAME_CONFIG.SPIN_DURATION)
    }
  }, [isSpinning, rotation, onResult])

  const sectionAngle = 360 / GAME_CONFIG.WHEEL_SECTIONS.length

  return (
    <div className="relative">
      <div className="relative w-80 h-80 mx-auto overflow-hidden rounded-full">
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className={`transform transition-transform duration-3000 ease-out ${
            isSpinning ? 'animate-spin-slow' : ''
          }`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: '160px 160px'
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
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
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