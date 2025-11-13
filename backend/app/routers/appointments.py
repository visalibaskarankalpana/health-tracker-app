from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.schemas import AppointmentCreate, AppointmentOut
from ..models.models import Appointment, Doctor, Patient

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.get("", response_model=list[AppointmentOut])
def list_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).order_by(Appointment.date.asc()).all()

@router.post("", response_model=AppointmentOut)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    if payload.doctor_id and not db.get(Doctor, payload.doctor_id):
        raise HTTPException(400, "Invalid doctor")
    if payload.patient_id and not db.get(Patient, payload.patient_id):
        raise HTTPException(400, "Invalid patient")
    a = Appointment(**payload.dict())
    db.add(a); db.commit(); db.refresh(a)
    return a

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    a = db.get(Appointment, appointment_id)
    if not a:
        raise HTTPException(404, "Not found")
    db.delete(a); db.commit()
    return {"ok": True}
