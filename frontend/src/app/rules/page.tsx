'use client'

import Link from 'next/link'
import { GAME_CONFIG } from '@/constants/gameConfig'

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎰</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">ルーレットゲーム ルール</h1>
            <p className="text-gray-600">ゲームの遊び方と仕組みを説明します</p>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">1</span>
                基本ルール
              </h2>
              <ul className="space-y-2 text-gray-700 ml-11">
                <li>• ルーレットホイールには8個の絵柄があります</li>
                <li>• 好きな絵柄にポイントをベットできます</li>
                <li>• 複数の絵柄に同時にベットすることも可能です</li>
                <li>• ベット後、「スピン」ボタンを押してルーレットを回転させます</li>
              </ul>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">2</span>
                ベットシステム
              </h2>
              <ul className="space-y-2 text-gray-700 ml-11">
                <li>• 初期ポイント：{GAME_CONFIG.INITIAL_SCORE}ポイント</li>
                <li>• 各絵柄に最低{GAME_CONFIG.BET_AMOUNTS[0]}ポイントからベット可能</li>
                <li>• ベットしたポイント数によって当選時の配当が決まります</li>
                <li>• 所持ポイント以上はベットできません</li>
              </ul>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">3</span>
                配当システム
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-gray-700">当選した場合の配当は以下の通りです：</p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="font-semibold text-lg text-purple-600">配当倍率：{GAME_CONFIG.PAYOUT_MULTIPLIER}倍</p>
                  <p className="text-gray-600 text-sm mt-1">例：{GAME_CONFIG.BET_AMOUNTS[0]}ポイントベットして当選した場合、{GAME_CONFIG.PAYOUT_MULTIPLIER * GAME_CONFIG.BET_AMOUNTS[0]}ポイントを獲得</p>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• 当選しなかった絵柄にベットしたポイントは失われます</li>
                  <li>• 当選した場合、ベット額 × {GAME_CONFIG.PAYOUT_MULTIPLIER}倍のポイントを獲得します</li>
                  <li>• 複数の絵柄にベットしても、当選するのは1つの絵柄のみです</li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg mr-3">4</span>
                ゲームの流れ
              </h2>
              <div className="ml-11 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">STEP 1</span>
                  <span className="text-gray-700">好きな絵柄を選んでベット額を決める</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">STEP 2</span>
                  <span className="text-gray-700">「スピン」ボタンを押してルーレットを回転</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">STEP 3</span>
                  <span className="text-gray-700">結果発表！当選した場合は配当を獲得</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">STEP 4</span>
                  <span className="text-gray-700">連続当選回数や獲得ポイントをチェック</span>
                </div>
              </div>
            </section>

            <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                攻略のコツ
              </h2>
              <ul className="space-y-2 text-yellow-800">
                <li>• 一度に多額をベットするのではなく、少額ずつ楽しむことをお勧めします</li>
                <li>• 複数の絵柄にベットすることで当選確率を上げることができます</li>
                <li>• 連続当選を狙って同じ絵柄にベットし続けるのも一つの戦略です</li>
                <li>• ポイントがなくなっても、ログインすることで統計を確認できます</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link href="/roulette">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                ゲームを始める
              </button>
            </Link>
            <div className="mt-4">
              <Link href="/">
                <button className="bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors">
                  ホームに戻る
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}