"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime
from pydantic import BaseModel, field_validator
from typing import Optional


# ─── Auth ───

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    phone: Optional[str] = None
    nationality: Optional[str] = None
    language: str = "fr"
    supported_team: Optional[str] = None
    fan_profile: str = "solo"

    @field_validator("language")
    @classmethod
    def valid_language(cls, v: str) -> str:
        if v not in ("fr", "en", "es", "ar"):
            raise ValueError("Langue invalide")
        return v

    @field_validator("fan_profile")
    @classmethod
    def valid_profile(cls, v: str) -> str:
        if v not in ("solo", "family", "tourist", "local", "group", "calm"):
            raise ValueError("Profil fan invalide")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    fan_id: str
    avatar_initials: str
    fan_id_status: str


# ─── Profile ───

class ProfileResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    nationality: Optional[str]
    language: str
    supported_team: Optional[str]
    fan_profile: str
    fan_id_status: str
    document_type: Optional[str]
    document_number: Optional[str]
    avatar_initials: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ProfileUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    nationality: Optional[str] = None
    language: Optional[str] = None
    supported_team: Optional[str] = None
    fan_profile: Optional[str] = None

    @field_validator("language")
    @classmethod
    def valid_language(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("fr", "en", "es", "ar"):
            raise ValueError("Langue invalide")
        return v

    @field_validator("fan_profile")
    @classmethod
    def valid_profile(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("solo", "family", "tourist", "local", "group", "calm"):
            raise ValueError("Profil fan invalide")
        return v


# ─── FanID ───

class FanIdVerifyRequest(BaseModel):
    document_type: str
    document_number: str

    @field_validator("document_type")
    @classmethod
    def valid_doc_type(cls, v: str) -> str:
        if v not in ("passport", "id_card", "residence_permit"):
            raise ValueError("Type de document invalide")
        return v


class FanIdStatusResponse(BaseModel):
    fan_id_status: str
    document_type: Optional[str]
    document_number: Optional[str]
    can_verify: bool
