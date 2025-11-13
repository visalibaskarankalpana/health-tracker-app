from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.schemas import PatientCreate, PatientOut
from ..models.models import Patient

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("", response_model=list[PatientOut])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@router.post("", response_model=PatientOut)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    p = Patient(**payload.dict())
    db.add(p); db.commit(); db.refresh(p)
    return p

@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    p = db.get(Patient, patient_id)
    if not p:
        raise HTTPException(404, "Patient not found")
    db.delete(p); db.commit()
    return {"ok": True}
