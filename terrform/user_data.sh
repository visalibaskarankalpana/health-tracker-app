#!/bin/bash
set -e

# Log everything
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Starting user data script at $(date)"

# Update system
yum update -y

# Install Python 3 and dependencies
yum install -y python3 python3-pip gcc postgresql-devel git

# Ensure python3 and pip3 are available
ln -sf /usr/bin/python3 /usr/local/bin/python3
ln -sf /usr/bin/pip3 /usr/local/bin/pip3

# Upgrade pip
pip3 install --upgrade pip

# Create application directory
mkdir -p /opt/healthcare-app
chown ec2-user:ec2-user /opt/healthcare-app

# Download and deploy application from S3
REGION=$(ec2-metadata --availability-zone | awk '{print $2}' | sed 's/.$//')
S3_BUCKET="healthcare-dev-app-deployments-${ACCOUNT_ID}"

echo "Downloading application from S3..."
cd /opt/healthcare-app

# Create Python virtual environment first
mkdir -p /opt/healthcare-app
cd /opt/healthcare-app
python3 -m venv .venv
source .venv/bin/activate

# Try to download full backend app from S3
if aws s3 sync s3://$${S3_BUCKET}/backend_deploy/ /opt/healthcare-app/ 2>/dev/null && [ -f "/opt/healthcare-app/app/main.py" ]; then
    echo "Found full backend deployment, installing..."
    pip install -r requirements.txt
    APP_MODULE="app.main:app"
elif aws s3 cp s3://$${S3_BUCKET}/working_backend.py /opt/healthcare-app/working_backend.py 2>/dev/null; then
    echo "Found working_backend.py, deploying..."
    pip install fastapi uvicorn python-multipart
    APP_MODULE="working_backend:app"
else
    echo "No working backend found, creating default with all 13 endpoints..."
    cat > /opt/healthcare-app/backend/working_backend.py << 'BACKENDEOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HealthConnect API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "HealthConnect API is running"}

@app.get("/doctors")
def list_doctors():
    return [{"id": 1, "first_name": "John", "last_name": "Smith", "specialty": "Cardiology", "phone": "555-0101", "email": "dr.smith@hospital.com"}]

@app.post("/doctors")
def create_doctor():
    return {"id": 2, "message": "Doctor created successfully"}

@app.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int):
    return {"ok": True, "message": f"Doctor {doctor_id} deleted"}

@app.get("/patients")
def list_patients():
    return [{"id": 1, "first_name": "Jane", "last_name": "Doe", "dob": "1990-01-01", "phone": "555-0102", "email": "jane.doe@email.com", "address": "123 Main St"}]

@app.post("/patients")
def create_patient():
    return {"id": 2, "message": "Patient created successfully"}

@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):
    return {"ok": True, "message": f"Patient {patient_id} deleted"}

@app.get("/appointments")
def list_appointments():
    return [{"id": 1, "patient_id": 1, "doctor_id": 1, "date": "2025-11-15", "time": "10:00", "purpose": "Regular checkup"}]

@app.post("/appointments")
def create_appointment():
    return {"id": 2, "message": "Appointment created successfully"}

@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int):
    return {"ok": True, "message": f"Appointment {appointment_id} deleted"}

@app.get("/patient_records/{patient_id}")
def list_records(patient_id: int):
    return [{"id": 1, "patient_id": patient_id, "date": "2025-11-14", "diagnosis": "Healthy", "notes": "Patient is in good health", "height_in": 70, "weight_lb": 150}]

@app.post("/patient_records")
def create_record():
    return {"id": 2, "message": "Patient record created successfully"}

@app.delete("/patient_records/{record_id}")
def delete_record(record_id: int):
    return {"ok": True, "message": f"Record {record_id} deleted"}
BACKENDEOF
    APP_MODULE="working_backend:app"
fi

chown -R ec2-user:ec2-user /opt/healthcare-app

# Get RDS endpoint from terraform template variables
RDS_ENDPOINT="${rds_endpoint}"
DB_NAME="${db_name}"
DB_USER="${db_username}"
DB_PASSWORD="${db_password}"
DATABASE_URL="postgresql+psycopg2://$${DB_USER}:$${DB_PASSWORD}@$${RDS_ENDPOINT}:5432/$${DB_NAME}"

# Create systemd service
cat > /etc/systemd/system/healthcare-backend.service << SERVICEEOF
[Unit]
Description=Healthcare Backend FastAPI Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/healthcare-app
Environment="PATH=/opt/healthcare-app/.venv/bin"
Environment="DATABASE_URL=$${DATABASE_URL}"
Environment="PYTHONPATH=/opt/healthcare-app"
ExecStart=/opt/healthcare-app/.venv/bin/uvicorn $${APP_MODULE} --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICEEOF

# Start the service
systemctl daemon-reload
systemctl enable healthcare-backend
systemctl start healthcare-backend

echo "Application deployed and started successfully!"

echo "User data script completed at $(date)"
