from sqlalchemy import Integer, String, Date, Time, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import Column
from datetime import datetime
from typing import Optional
from ..database import Base

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    specialty = Column(String, default="")
    phone = Column(String, default="")
    email = Column(String, default="")

    appointments = relationship("Appointment", back_populates="doctor")
    records = relationship("PatientRecord", back_populates="doctor")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    dob = Column(Date, nullable=True)
    phone = Column(String, default="")
    email = Column(String, default="")
    address = Column(String, default="")

    appointments = relationship("Appointment", back_populates="patient")
    records = relationship("PatientRecord", back_populates="patient", cascade="all, delete-orphan")

class PatientRecord(Base):
    __tablename__ = "patient_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    notes = Column(Text, default="")
    height_in = Column(Integer, nullable=True)
    weight_lb = Column(Integer, nullable=True)
    diagnosis = Column(String, default="")

    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)

    patient = relationship("Patient", back_populates="records")
    doctor = relationship("Doctor", back_populates="records")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=True)
    purpose = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)

    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")
