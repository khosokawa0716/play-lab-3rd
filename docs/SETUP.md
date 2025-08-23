# 🛠 プレイラボ！ セットアップガイド

## 📋 前提条件

- Node.js 18以上
- Python 3.9以上
- MySQL 8.0以上

## 🏁 ローカル開発環境セットアップ

### 1. プロジェクトクローン

```bash
git clone <repository-url>
cd play-lab-3rd
```

### 2. フロントエンド セットアップ

```bash
cd frontend
npm install
cp .env.example .env.local
```

`.env.local` を編集：
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

フロントエンド起動：
```bash
npm run dev
```

### 3. バックエンド セットアップ

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

`.env` を編集：
```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/playlab
SECRET_KEY=your-super-secret-jwt-key-here
```

### 4. データベース セットアップ

MySQLにデータベースを作成：
```sql
CREATE DATABASE playlab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

マイグレーション実行：
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

バックエンド起動：
```bash
uvicorn main:app --reload
```

## 🚀 デプロイガイド

### フロントエンド (Vercel)

1. Vercelアカウントでプロジェクトを新規作成
2. GitHubリポジトリを接続
3. ビルド設定：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Root Directory: `frontend`
4. 環境変数を設定：
   - `NEXT_PUBLIC_API_URL`: バックエンドURL

### バックエンド (Render)

1. Renderでnew Web Serviceを作成
2. GitHubリポジトリを接続
3. 設定：
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `backend`
4. 環境変数を設定：
   - `DATABASE_URL`: MySQL接続文字列
   - `SECRET_KEY`: JWT用シークレットキー

### データベース (Render MySQL)

1. RenderでMySQL Instanceを作成
2. 接続情報をバックエンドの環境変数に設定
3. マイグレーション実行：
```bash
alembic upgrade head
```

## 🎮 API エンドポイント

### 認証
- `POST /api/v1/auth/register` - ユーザー登録
- `POST /api/v1/auth/token` - ログイン

### ユーザー
- `GET /api/v1/users/profile` - プロフィール取得

### ゲーム
- `POST /api/v1/games/roulette/spin` - ルーレット実行
- `GET /api/v1/games/scores` - スコア履歴
- `POST /api/v1/games/daily-bonus` - デイリーボーナス

## 🔧 トラブルシューティング

### よくある問題

1. **データベース接続エラー**
   - MySQL サービスが起動しているか確認
   - 接続文字列が正しいか確認

2. **CORS エラー**
   - バックエンドのALLOWED_HOSTS設定を確認
   - フロントエンドのAPI URLが正しいか確認

3. **JWT トークンエラー**
   - SECRET_KEY が設定されているか確認
   - トークンの有効期限を確認