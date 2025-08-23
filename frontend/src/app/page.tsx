export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="game-title">🎮 プレイラボ！</h1>
        <p className="text-xl text-gray-600 mb-8">
          楽しく学べるゲームセンターへようこそ！
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-game-primary mb-4">🎰 ルーレットゲーム</h2>
            <p className="text-gray-600 mb-4">
              ランダムに変化する図柄を予測して当てる、直感的なタイミングゲーム
            </p>
            <button className="btn-primary w-full">
              ゲームを始める
            </button>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold text-game-secondary mb-4">🎁 ログインボーナス</h2>
            <p className="text-gray-600 mb-4">
              毎日ログインして特別な報酬をゲットしよう！
            </p>
            <button className="btn-secondary w-full">
              ボーナスを受け取る
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="btn-accent mr-4">
            ログイン
          </button>
          <button className="bg-white border-2 border-game-accent text-game-accent font-bold py-3 px-6 rounded-lg hover:bg-game-accent hover:text-white transition-colors duration-200 text-lg">
            新規登録
          </button>
        </div>
      </div>
    </div>
  )
}