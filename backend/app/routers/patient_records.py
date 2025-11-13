from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.schemas import PatientRecordCreate, PatientRecordOut
from ..models.models import PatientRecord, Patient, Doctor

router = APIRouter(prefix="/patient_records", tags=["patient_records"])

@router.get("/{patient_id}", response_model=list[PatientRecordOut])
def list_records(patient_id: int, db: Session = Depends(get_db)):
    return db.query(PatientRecord).filter(PatientRecord.patient_id==patient_id).order_by(PatientRecord.date.desc()).all()

@router.post("", response_model=PatientRecordOut)
def create_record(payload: PatientRecordCreate, db: Session = Depends(get_db)):
    if not db.get(Patient, payload.patient_id):
        raise HTTPException(400, "Invalid patient")
    if payload.doctor_id and not db.get(Doctor, payload.doctor_id):
        raise HTTPException(400, "Invalid doctor")
    r = PatientRecord(**payload.dict())
    db.add(r); db.commit(); db.refresh(r)
    return r

@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    r = db.get(PatientRecord, record_id)
    if not r:
        raise HTTPException(404, "Record not found")
    db.delete(r); db.commit()
    return {"ok": True}
