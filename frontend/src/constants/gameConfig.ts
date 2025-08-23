export const GAME_CONFIG = {
  // ゲーム基本設定
  INITIAL_SCORE: 1000,
  PAYOUT_MULTIPLIER: 5,
  
  // ベット設定
  BET_AMOUNTS: [10, 50, 100, 500],
  
  // アニメーション設定
  SPIN_DURATION: 3500, // ms
  ANIMATION_DELAY: 1000, // ms
  SPIN_ROTATIONS: 5, // 回転数
  
  // ルーレット設定
  WHEEL_SECTIONS: [
    { id: 1, color: '#ef4444', emoji: '🍎', label: 'りんご' },
    { id: 2, color: '#f59e0b', emoji: '🍌', label: 'バナナ' },
    { id: 3, color: '#10b981', emoji: '🍇', label: 'ぶどう' },
    { id: 4, color: '#3b82f6', emoji: '🍓', label: 'いちご' },
    { id: 5, color: '#8b5cf6', emoji: '🍑', label: 'さくらんぼ' },
    { id: 6, color: '#f97316', emoji: '🥕', label: 'にんじん' },
    { id: 7, color: '#06b6d4', emoji: '🐟', label: 'さかな' },
    { id: 8, color: '#84cc16', emoji: '⭐', label: 'スター' }
  ]
} as const

export type WheelSection = typeof GAME_CONFIG.WHEEL_SECTIONS[number]