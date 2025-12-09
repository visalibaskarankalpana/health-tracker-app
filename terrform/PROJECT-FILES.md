# Project Files - Clean Structure

## ✅ Essential Files

### Infrastructure (Terraform)
```
*.tf                  - Terraform configuration files
  - main.tf
  - variables.tf
  - outputs.tf
  - vpc.tf
  - ec2.tf
  - rds.tf
  - security_group.tf
  - load_balancer.tf
  - s3.tf
  - codepipeline.tf

terraform.tfvars      - Variable values
user_data.sh          - EC2 initialization script
```

### Scripts
```
connect.sh            - Connect frontend to backend (main script)
```

### Documentation
```
README.md             - Main project documentation
SIMPLE-CONNECT-GUIDE.md - How to use connect.sh script
RUN-CONNECT.txt       - Quick reference for running script
SUCCESS.md            - Setup success confirmation
PROJECT-FILES.md      - This file (file structure guide)
```

### Backend Code
```
backend_deploy/       - Backend application code
  - app/
    - main.py         - FastAPI application
    - database.py     - Database connection
    - models.py       - SQLAlchemy models
    - schemas.py      - Pydantic schemas
    - crud.py         - CRUD operations
  - requirements.txt  - Python dependencies
```
---

## 📁 Project Structure

```
NEW-13-11/
├── Infrastructure (Terraform)
│   ├── *.tf                    # All Terraform files
│   ├── terraform.tfvars        # Variable values
│   ├── terraform.tfstate       # State file (auto-generated)
│   └── user_data.sh            # EC2 initialization
│
├── Scripts
│   └── connect.sh              # Frontend-backend connection
│
├── Documentation
│   ├── README.md               # Main docs
│   ├── SIMPLE-CONNECT-GUIDE.md # Usage guide
│   ├── RUN-CONNECT.txt         # Quick reference
│   ├── SUCCESS.md              # Success confirmation
│   └── PROJECT-FILES.md        # This file
│
└── Backend Code
    └── backend_deploy/
        ├── app/                # FastAPI application
        └── requirements.txt    # Dependencies
```

---

## 🚀 Quick Start

### 1. Infrastructure
```bash
# Create infrastructure
C:\terraform\terraform.exe apply -auto-approve

# Wait 4 minutes for backend to initialize
```

### 2. Connect Frontend
```bash
# Open Git Bash
cd /c/Users/Ajay/Downloads/NEW-13-11

# Verify setup
./connect.sh verify

# Connect frontend to backend
./connect.sh connect
```

### 3. Access Application
- **Frontend:** https://healthconnect.space
- **Backend:** http://healthcare-dev-alb-985138781.us-east-2.elb.amazonaws.com
- **API Docs:** http://healthcare-dev-alb-985138781.us-east-2.elb.amazonaws.com/docs

---

## 📝 Key Documentation

### For Users
- **RUN-CONNECT.txt** - How to run the connect script
- **SIMPLE-CONNECT-GUIDE.md** - Detailed script usage guide

### For Reference
- **README.md** - Complete project overview
- **SUCCESS.md** - Setup verification and success confirmation
- **PROJECT-FILES.md** - This file (project structure)

---

## ✅ Project Status

**Infrastructure:** ✅ Healthy
- EC2 Instance: `i-05db1cbd26c1da03a`
- Target Group: Healthy
- Backend: Running with PostgreSQL
- RDS: `healthcare-dev-db.c5ugs68yun3v.us-east-2.rds.amazonaws.com`

**Application:** ✅ Operational
- Frontend: `https://healthconnect.space`
- Backend: `http://healthcare-dev-alb-985138781.us-east-2.elb.amazonaws.com`
- Database: Connected and working

**Scripts:** ✅ Simplified
- No Terraform dependency
- Backend URL hardcoded
- Easy to use

---

## 🎯 Everything is Ready!

All unnecessary files have been removed. The project is clean and ready to use.

**To connect frontend and backend:**
```bash
./connect.sh connect
```

🚀 Your HealthConnect application is fully operational!
