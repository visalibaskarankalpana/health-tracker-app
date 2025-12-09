from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.schemas import PatientRecordCreate, PatientRecordOut
from ..models.models import PatientRecord

router = APIRouter(prefix="/patient_records", tags=["Patient Records"])

@router.get("/{patient_id}", response_model=List[PatientRecordOut])
def list_records(patient_id: int, db: Session = Depends(get_db)):
    """Get all records for a specific patient"""
    return db.query(PatientRecord).filter(PatientRecord.patient_id == patient_id).all()

@router.post("", response_model=PatientRecordOut, status_code=201)
def create_record(payload: PatientRecordCreate, db: Session = Depends(get_db)):
    """Create a new patient record"""
    r = PatientRecord(**payload.dict())
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    """Delete a patient record by ID"""
    r = db.query(PatientRecord).filter(PatientRecord.id == record_id).first()
    if not r:
        raise HTTPException(404, "Record not found")
    db.delete(r)
    db.commit()
    return {"ok": True, "message": f"Record {record_id} deleted successfully"}
