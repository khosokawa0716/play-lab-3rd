from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.user import User
from app.models.game import GameScore, DailyBonus
from app.routers.auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime, date

router = APIRouter()

class RouletteResult(BaseModel):
    symbol: str
    won: bool
    score: int

class GameScoreResponse(BaseModel):
    id: int
    user_id: int
    game_type: str
    score: int
    details: Optional[str] = None
    played_at: datetime

class GameResultCreate(BaseModel):
    game_type: str
    score: int
    details: Optional[str] = None

class UserGameStats(BaseModel):
    total_games: int
    total_score: int
    best_score: int
    average_score: float
    recent_games: List[GameScoreResponse]

@router.post("/roulette/spin", response_model=RouletteResult)
async def spin_roulette(current_user: User = Depends(), db: Session = Depends(get_db)):
    # ルーレットゲームロジック
    symbols = ["🍎", "🍊", "🍋", "🍇", "🍓", "🥝"]
    result_symbol = random.choice(symbols)
    
    # 簡単なスコア計算
    base_score = random.randint(10, 100)
    won = random.choice([True, False])
    final_score = base_score if won else 0
    
    # スコア保存
    game_score = GameScore(
        user_id=current_user.id,
        game_type="roulette",
        score=final_score,
        details=f"symbol:{result_symbol},won:{won}"
    )
    db.add(game_score)
    db.commit()
    
    return RouletteResult(
        symbol=result_symbol,
        won=won,
        score=final_score
    )

@router.get("/scores", response_model=List[GameScoreResponse])
async def get_user_scores(current_user: User = Depends(), db: Session = Depends(get_db)):
    scores = db.query(GameScore).filter(
        GameScore.user_id == current_user.id
    ).order_by(GameScore.played_at.desc()).limit(20).all()
    
    return [
        GameScoreResponse(
            id=score.id,
            game_type=score.game_type,
            score=score.score,
            played_at=score.played_at
        )
        for score in scores
    ]

@router.post("/daily-bonus")
async def claim_daily_bonus(current_user: User = Depends(), db: Session = Depends(get_db)):
    today = date.today()
    existing_bonus = db.query(DailyBonus).filter(
        DailyBonus.user_id == current_user.id,
        DailyBonus.bonus_date >= today
    ).first()
    
    if existing_bonus:
        raise HTTPException(status_code=400, detail="Daily bonus already claimed")
    
    bonus = DailyBonus(
        user_id=current_user.id,
        bonus_amount=100
    )
    db.add(bonus)
    db.commit()
    
    return {"message": "Daily bonus claimed!", "amount": 100}

# フロントエンドが期待するAPIエンドポイント
@router.post("/scores", response_model=GameScoreResponse)
async def save_game_result(
    game_result: GameResultCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """ゲーム結果を保存"""
    game_score = GameScore(
        user_id=current_user.id,
        game_type=game_result.game_type,
        score=game_result.score,
        details=game_result.details
    )
    db.add(game_score)
    db.commit()
    db.refresh(game_score)
    
    return GameScoreResponse(
        id=game_score.id,
        user_id=game_score.user_id,
        game_type=game_score.game_type,
        score=game_score.score,
        details=game_score.details,
        played_at=game_score.played_at
    )

@router.get("/stats", response_model=UserGameStats)
async def get_user_game_stats(
    game_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """ユーザーのゲーム統計を取得"""
    query = db.query(GameScore).filter(GameScore.user_id == current_user.id)
    
    if game_type:
        query = query.filter(GameScore.game_type == game_type)
    
    # 統計計算
    total_games = query.count()
    if total_games == 0:
        return UserGameStats(
            total_games=0,
            total_score=0,
            best_score=0,
            average_score=0.0,
            recent_games=[]
        )
    
    total_score = query.with_entities(func.sum(GameScore.score)).scalar() or 0
    best_score = query.with_entities(func.max(GameScore.score)).scalar() or 0
    average_score = total_score / total_games if total_games > 0 else 0.0
    
    # 最近のゲーム履歴
    recent_games = query.order_by(GameScore.played_at.desc()).limit(10).all()
    
    return UserGameStats(
        total_games=total_games,
        total_score=total_score,
        best_score=best_score,
        average_score=average_score,
        recent_games=[
            GameScoreResponse(
                id=game.id,
                user_id=game.user_id,
                game_type=game.game_type,
                score=game.score,
                details=game.details,
                played_at=game.played_at
            )
            for game in recent_games
        ]
    )

@router.get("/history", response_model=List[GameScoreResponse])
async def get_user_game_history(
    game_type: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """ユーザーのゲーム履歴を取得"""
    query = db.query(GameScore).filter(GameScore.user_id == current_user.id)
    
    if game_type:
        query = query.filter(GameScore.game_type == game_type)
    
    games = query.order_by(GameScore.played_at.desc()).limit(limit).all()
    
    return [
        GameScoreResponse(
            id=game.id,
            user_id=game.user_id,
            game_type=game.game_type,
            score=game.score,
            details=game.details,
            played_at=game.played_at
        )
        for game in games
    ]