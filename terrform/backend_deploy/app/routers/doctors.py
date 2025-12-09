from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.schemas import DoctorCreate, DoctorOut
from ..models.models import Doctor

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("", response_model=List[DoctorOut])
def list_doctors(db: Session = Depends(get_db)):
    """Get all doctors"""
    return db.query(Doctor).all()

@router.post("", response_model=DoctorOut, status_code=201)
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    """Create a new doctor"""
    d = Doctor(**payload.dict())
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Delete a doctor by ID"""
    d = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not d:
        raise HTTPException(404, "Doctor not found")
    db.delete(d)
    db.commit()
    return {"ok": True, "message": f"Doctor {doctor_id} deleted successfully"}
