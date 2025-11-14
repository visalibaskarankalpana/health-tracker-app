# backend/app/routers/appointments.py

from datetime import datetime, time as Time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas.schemas import AppointmentCreate, AppointmentOut
from ..models.models import Appointment, Doctor, Patient

router = APIRouter(prefix="/appointments", tags=["appointments"])


def _parse_time(value: Optional[str]) -> Optional[Time]:
    """
    Accepts:
      - "14:30"  (24-hour, from <input type='time'>)
      - "02:30 PM" (12-hour, from Swagger/manual)
    Returns a datetime.time or None.
    """
    if value is None:
        return None

    # Try 24-hour "HH:MM"
    for fmt in ("%H:%M", "%I:%M %p"):
        try:
            return datetime.strptime(value, fmt).time()
        except ValueError:
            continue

    raise HTTPException(
        status_code=400,
        detail="Invalid time format. Use 'HH:MM' or 'HH:MM AM/PM'.",
    )


@router.get("", response_model=list[AppointmentOut])
def list_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(Appointment.date.asc()).all()


@router.post("", response_model=AppointmentOut)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    # Dump all fields (including frontend-only ones)
    data = payload.model_dump(exclude_none=True)

    # Remove UI-only fields
    for field in ("full_name", "email", "phone", "department"):
        data.pop(field, None)

    # Convert string "time" to Python time object for SQLite
    time_str = data.get("time")
    data["time"] = _parse_time(time_str)

    # If doctor_id / patient_id are provided but don't exist, just drop them
    doc_id = data.get("doctor_id")
    if doc_id is not None and not db.get(Doctor, doc_id):
        data["doctor_id"] = None

    pat_id = data.get("patient_id")
    if pat_id is not None and not db.get(Patient, pat_id):
        data["patient_id"] = None

    # Create and return appointment
    a = Appointment(**data)
    db.add(a)
    db.commit()
    db.refresh(a)
    return a


@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    a = db.get(Appointment, appointment_id)
    if not a:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(a)
    db.commit()
    return {"ok": True}
