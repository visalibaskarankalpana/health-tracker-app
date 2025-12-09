from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.schemas import PatientCreate, PatientOut
from ..models.models import Patient

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("", response_model=List[PatientOut])
def list_patients(db: Session = Depends(get_db)):
    """Get all patients"""
    return db.query(Patient).all()

@router.post("", response_model=PatientOut, status_code=201)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient"""
    p = Patient(**payload.dict())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """Delete a patient by ID"""
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(404, "Patient not found")
    db.delete(p)
    db.commit()
    return {"ok": True, "message": f"Patient {patient_id} deleted successfully"}
