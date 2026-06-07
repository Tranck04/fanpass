"""
Auth endpoints: register, login, profile, FanID verification.
JWT-based authentication.
"""

import os
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import bcrypt
from database import get_db
from models import Fan
from schemas import (
    RegisterRequest, LoginRequest, TokenResponse,
    ProfileResponse, ProfileUpdateRequest,
    FanIdVerifyRequest, FanIdStatusResponse,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ─── Security config ───

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fanpass-dev-secret-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_fan(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Fan:
    """Extract and validate the current fan from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Identifiants invalides",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        fan_id: str = payload.get("sub")
        if fan_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    fan = db.query(Fan).filter(Fan.id == fan_id).first()
    if fan is None:
        raise credentials_exception
    return fan


# ─── Endpoints ───

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    """Créer un compte fan."""
    existing = db.query(Fan).filter(Fan.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    avatar = f"{body.first_name[0]}{body.last_name[0]}".upper()

    fan = Fan(
        first_name=body.first_name,
        last_name=body.last_name,
        email=body.email,
        password_hash=hash_password(body.password),
        phone=body.phone,
        nationality=body.nationality,
        language=body.language,
        supported_team=body.supported_team,
        fan_profile=body.fan_profile,
        avatar_initials=avatar,
    )
    db.add(fan)
    db.commit()
    db.refresh(fan)

    token = create_access_token({"sub": fan.id})
    return TokenResponse(
        access_token=token,
        fan_id=fan.id,
        avatar_initials=fan.avatar_initials,
        fan_id_status=fan.fan_id_status,
    )


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """Connecter un fan existant."""
    fan = db.query(Fan).filter(Fan.email == body.email).first()
    if not fan or not verify_password(body.password, fan.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    token = create_access_token({"sub": fan.id})
    return TokenResponse(
        access_token=token,
        fan_id=fan.id,
        avatar_initials=fan.avatar_initials,
        fan_id_status=fan.fan_id_status,
    )


@router.get("/me", response_model=ProfileResponse)
def get_me(fan: Fan = Depends(get_current_fan)):
    """Récupérer le profil du fan connecté."""
    return fan


@router.put("/me", response_model=ProfileResponse)
def update_me(body: ProfileUpdateRequest, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Mettre à jour le profil."""
    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(fan, key, value)

    # Recompute avatar
    fan.avatar_initials = f"{fan.first_name[0]}{fan.last_name[0]}".upper()

    db.commit()
    db.refresh(fan)
    return fan


# ─── FanID ───

@router.get("/fanid/status", response_model=FanIdStatusResponse)
def get_fanid_status(fan: Fan = Depends(get_current_fan)):
    """Statut actuel du Fan ID."""
    return FanIdStatusResponse(
        fan_id_status=fan.fan_id_status,
        document_type=fan.document_type,
        document_number=fan.document_number,
        can_verify=fan.fan_id_status in ("pending", "rejected", "expired"),
    )


@router.post("/fanid/verify", response_model=FanIdStatusResponse)
def verify_fanid(body: FanIdVerifyRequest, fan: Fan = Depends(get_current_fan), db: Session = Depends(get_db)):
    """Soumettre les documents pour vérification du Fan ID."""
    if fan.fan_id_status == "verified":
        raise HTTPException(status_code=400, detail="Fan ID déjà vérifié")

    fan.document_type = body.document_type
    fan.document_number = body.document_number
    fan.fan_id_status = "verified"
    fan.document_verified_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(fan)

    return FanIdStatusResponse(
        fan_id_status=fan.fan_id_status,
        document_type=fan.document_type,
        document_number=fan.document_number,
        can_verify=False,
    )
