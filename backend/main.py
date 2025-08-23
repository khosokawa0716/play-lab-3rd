from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, users, games

app = FastAPI(
    title="プレイラボ！ API",
    description="子ども向けWebゲームセンターのバックエンドAPI",
    version="1.0.0"
)

# 開発用に緩いCORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発時のみ、本番では具体的なドメインを指定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["認証"])
app.include_router(users.router, prefix="/api/v1/users", tags=["ユーザー"])
app.include_router(games.router, prefix="/api/v1/games", tags=["ゲーム"])

@app.get("/")
async def root():
    return {"message": "プレイラボ！ API サーバーが稼働中です 🎮"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "playlab-api"}