from sqlalchemy import Integer, String, Date, Time, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from ..database import Base

class Doctor(Base):
    __tablename__ = "doctors"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    specialty: Mapped[str] = mapped_column(String, default="")
    phone: Mapped[str] = mapped_column(String, default="")
    email: Mapped[str] = mapped_column(String, default="")

    appointments = relationship("Appointment", back_populates="doctor")
    records = relationship("PatientRecord", back_populates="doctor")

class Patient(Base):
    __tablename__ = "patients"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    dob: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    phone: Mapped[str] = mapped_column(String, default="")
    email: Mapped[str] = mapped_column(String, default="")
    address: Mapped[str] = mapped_column(String, default="")

    appointments = relationship("Appointment", back_populates="patient")
    records = relationship("PatientRecord", back_populates="patient", cascade="all, delete-orphan")

class PatientRecord(Base):
    __tablename__ = "patient_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    date: Mapped[datetime] = mapped_column(Date, nullable=False)
    notes: Mapped[str] = mapped_column(Text, default="")
    height_in: Mapped[int | None] = mapped_column(Integer, nullable=True)
    weight_lb: Mapped[int | None] = mapped_column(Integer, nullable=True)
    diagnosis: Mapped[str] = mapped_column(String, default="")

    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))
    doctor_id: Mapped[int | None] = mapped_column(ForeignKey("doctors.id"), nullable=True)

    patient = relationship("Patient", back_populates="records")
    doctor = relationship("Doctor", back_populates="records")

class Appointment(Base):
    __tablename__ = "appointments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    date: Mapped[datetime] = mapped_column(Date, nullable=False)
    time: Mapped[datetime | None] = mapped_column(Time, nullable=True)
    purpose: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    doctor_id: Mapped[int | None] = mapped_column(ForeignKey("doctors.id"), nullable=True)
    patient_id: Mapped[int | None] = mapped_column(ForeignKey("patients.id"), nullable=True)

    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")
