from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import time as Time
from ..database import get_db
from ..schemas.schemas import AppointmentCreate, AppointmentOut
from ..models.models import Appointment

router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("", response_model=List[AppointmentOut])
def list_appointments(db: Session = Depends(get_db)):
    """Get all appointments"""
    return db.query(Appointment).all()

@router.post("", response_model=AppointmentOut, status_code=201)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    """Create a new appointment"""
    # Convert time string to time object if provided
    appointment_data = payload.dict(exclude_unset=True)
    
    # Remove frontend-only fields
    frontend_fields = ['full_name', 'email', 'phone', 'department']
    for field in frontend_fields:
        appointment_data.pop(field, None)
    
    # Parse time if it's a string
    if 'time' in appointment_data and isinstance(appointment_data['time'], str):
        try:
            hour, minute = map(int, appointment_data['time'].split(':'))
            appointment_data['time'] = Time(hour, minute)
        except:
            appointment_data['time'] = None
    
    a = Appointment(**appointment_data)
    db.add(a)
    db.commit()
    db.refresh(a)
    return a

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Delete an appointment by ID"""
    a = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not a:
        raise HTTPException(404, "Appointment not found")
    db.delete(a)
    db.commit()
    return {"ok": True, "message": f"Appointment {appointment_id} deleted successfully"}
