from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class UserProfile(BaseModel):
    id: int
    email: str
    nickname: str

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: User = Depends(), db: Session = Depends(get_db)):
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        nickname=current_user.nickname
    )