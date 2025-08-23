from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "プレイラボ！"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # JWT Settings
    SECRET_KEY: str = "your-super-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = "mysql+pymysql://user:password@localhost:3306/playlab"
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://play-lab-3rd.vercel.app"
    ]
    
    # Game Settings
    DAILY_LOGIN_BONUS: int = 100
    MAX_ROULETTE_BET: int = 1000
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()