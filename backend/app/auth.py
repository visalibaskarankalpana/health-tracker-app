
from fastapi import HTTPException, Depends, Header
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from .database import get_db
from .models.models import User
import secrets

# naive token store (demo only)
TOKENS: dict[str, int] = {}

def hash_pw(pw: str) -> str:
    return bcrypt.hash(pw)

def verify_pw(pw: str, hashed: str) -> bool:
    return bcrypt.verify(pw, hashed)

def create_user(db: Session, username: str, password: str) -> User:
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    u = User(username=username, password_hash=hash_pw(password))
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

def login_user(db: Session, username: str, password: str) -> str:
    u = db.query(User).filter(User.username == username).first()
    if not u or not verify_pw(password, u.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = secrets.token_hex(16)
    TOKENS[token] = u.id
    return token

def get_current_user_id(authorization: str = Header(None)) -> int:
    # Expect "Bearer <token>"
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split()[1]
    user_id = TOKENS.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user_id
