from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from .models.models import Base
from .routers import doctors, patients, patient_records, appointments

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthConnect API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(doctors.router)
app.include_router(patients.router)
app.include_router(patient_records.router)
app.include_router(appointments.router)

@app.get("/")
def root():
    return {"status": "ok"}
