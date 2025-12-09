from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models.models import Base
from .routers import doctors, patients, patient_records, appointments

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HealthConnect API",
    version="2.0",
    description="Healthcare Management System with PostgreSQL Database"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(doctors.router)
app.include_router(patients.router)
app.include_router(patient_records.router)
app.include_router(appointments.router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "HealthConnect API is running with PostgreSQL"}
