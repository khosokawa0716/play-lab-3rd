from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.game import GameScore, DailyBonus
from pydantic import BaseModel
from typing import List
import random
from datetime import datetime, date

router = APIRouter()

class RouletteResult(BaseModel):
    symbol: str
    won: bool
    score: int

class GameScoreResponse(BaseModel):
    id: int
    game_type: str
    score: int
    played_at: datetime

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