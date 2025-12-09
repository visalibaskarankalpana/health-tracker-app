from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

# ==================== DOCTOR SCHEMAS ====================

class DoctorBase(BaseModel):
    first_name: str
    last_name: str
    specialty: str = ""
    phone: str = ""
    email: str = ""

class DoctorCreate(DoctorBase):
    class Config:
        schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Smith",
                "specialty": "Cardiology",
                "phone": "555-0101",
                "email": "dr.smith@hospital.com"
            }
        }

class DoctorOut(DoctorBase):
    id: int
    
    class Config:
        orm_mode = True

# ==================== PATIENT SCHEMAS ====================

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    dob: Optional[date] = None
    phone: str = ""
    email: str = ""
    address: str = ""

class PatientCreate(PatientBase):
    class Config:
        schema_extra = {
            "example": {
                "first_name": "Jane",
                "last_name": "Doe",
                "dob": "1990-01-01",
                "phone": "555-0102",
                "email": "jane.doe@email.com",
                "address": "123 Main St"
            }
        }

class PatientOut(PatientBase):
    id: int
    
    class Config:
        orm_mode = True

# ==================== PATIENT RECORD SCHEMAS ====================

class PatientRecordBase(BaseModel):
    date: date
    notes: str = ""
    height_in: Optional[int] = None
    weight_lb: Optional[int] = None
    diagnosis: str = ""
    patient_id: int
    doctor_id: Optional[int] = None

class PatientRecordCreate(PatientRecordBase):
    class Config:
        schema_extra = {
            "example": {
                "date": "2025-11-14",
                "notes": "Patient is in good health",
                "height_in": 70,
                "weight_lb": 150,
                "diagnosis": "Healthy",
                "patient_id": 1,
                "doctor_id": 1
            }
        }

class PatientRecordOut(PatientRecordBase):
    id: int
    
    class Config:
        orm_mode = True

# ==================== APPOINTMENT SCHEMAS ====================

class AppointmentBase(BaseModel):
    date: date
    time: Optional[str] = None
    purpose: Optional[str] = None
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None

class AppointmentCreate(AppointmentBase):
    # Extra frontend-only fields (accepted but not stored)
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "date": "2025-11-15",
                "time": "10:00",
                "purpose": "Regular checkup",
                "doctor_id": 1,
                "patient_id": 1
            }
        }

class AppointmentOut(AppointmentBase):
    id: int
    
    class Config:
        orm_mode = True
