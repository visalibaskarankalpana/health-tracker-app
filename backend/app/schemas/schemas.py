from pydantic import BaseModel, ConfigDict
from datetime import date, time
from typing import Optional

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

class AppointmentOut(AppointmentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
