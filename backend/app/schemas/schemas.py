from pydantic import BaseModel, ConfigDict
from datetime import date, time as Time
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr
# ---------- Doctor ----------
class DoctorBase(BaseModel):
    first_name: str
    last_name: str
    specialty: str = ""
    phone: str = ""
    email: str = ""

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(DoctorBase):
    id: int
    # Pydantic v2: ensure we can return ORM objects (SQLAlchemy rows)
    model_config = ConfigDict(from_attributes=True)


# ---------- Patient ----------
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    dob: Optional[date] = None
    phone: str = ""
    email: str = ""
    address: str = ""

class PatientCreate(PatientBase):
    pass

class PatientOut(PatientBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Patient Record ----------
class PatientRecordBase(BaseModel):
    date: date
    notes: str = ""
    height_in: Optional[int] = None
    weight_lb: Optional[int] = None
    diagnosis: str = ""
    patient_id: int
    doctor_id: Optional[int] = None

class PatientRecordCreate(PatientRecordBase):
    pass

class PatientRecordOut(PatientRecordBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Appointment ----------
class AppointmentBase(BaseModel):
    date: date
    time: Optional[time] = None # type: ignore
    purpose: str = ""
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None

class AppointmentCreate(AppointmentBase):
    pass

from datetime import date, time
from typing import Optional

from pydantic import BaseModel, EmailStr


# ─── Appointment Schemas ──────────────────────────────────────────────────────

# ----------------- Appointment Schemas ----------------- #

class AppointmentCreate(BaseModel):
    # Fields used by the Appointment DB model
    date: date
    # receive as string from JSON; we'll parse it in the router
    time: Optional[str] = None
    purpose: Optional[str] = None
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None

    # Extra frontend-only fields (accepted but not stored)
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    date: date
    # here we expose the real DB type (Time)
    time: Optional[Time] = None
    purpose: Optional[str] = None
    doctor_id: Optional[int] = None
    patient_id: Optional[int] = None

    # Pydantic v2: replacement for orm_mode = True
    model_config = ConfigDict(from_attributes=True)
