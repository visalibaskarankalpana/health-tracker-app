
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db, Base, engine
from ..schemas.schemas import UserCreate, TokenOut
from ..auth import create_user, login_user

# Create tables on startup
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=TokenOut)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    create_user(db, payload.username, payload.password)
    token = login_user(db, payload.username, payload.password)
    return TokenOut(token=token)

@router.post("/login", response_model=TokenOut)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    token = login_user(db, payload.username, payload.password)
    return TokenOut(token=token)
