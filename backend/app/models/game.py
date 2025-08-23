from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class GameScore(Base):
    __tablename__ = "game_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_type = Column(String(50), nullable=False)  # "roulette", "puzzle", etc.
    score = Column(Integer, nullable=False)
    details = Column(String(500))  # ゲーム詳細情報（JSON形式）
    played_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # リレーション
    user = relationship("User", back_populates="game_scores")

class DailyBonus(Base):
    __tablename__ = "daily_bonuses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bonus_date = Column(DateTime(timezone=True), server_default=func.now())
    bonus_amount = Column(Integer, default=100)
    received_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # リレーション
    user = relationship("User", back_populates="daily_bonuses")