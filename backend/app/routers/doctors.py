from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.schemas import DoctorCreate, DoctorOut
from ..models.models import Doctor

router = APIRouter(prefix="/doctors", tags=["doctors"])

@router.get("", response_model=list[DoctorOut])
def list_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@router.post("", response_model=DoctorOut)
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    d = Doctor(**payload.dict())
    db.add(d); db.commit(); db.refresh(d)
    return d

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    d = db.get(Doctor, doctor_id)
    if not d:
        raise HTTPException(404, "Doctor not found")
    db.delete(d); db.commit()
    return {"ok": True}
