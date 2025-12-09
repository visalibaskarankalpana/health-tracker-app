Health Tracker Application - Cloud Deployment

Project Overview

Health Tracker Application is a comprehensive healthcare management system deployed on AWS cloud infrastructure. This project implements a modern healthcare platform with telemedicine capabilities, patient data management, and secure cloud architecture, fully provisioned using Terraform and CI/CD pipelines.


Project Structure
```bash
HEALTH-TRACKER-APP/
├── .github/                    
├── backend/                    
├── app/                        
│   ├── .env                    
│   ├── health.db               
│   ├── README.md               
│   └── requirements.txt        
├── frontend/                   
│   ├── dist/                   
│   ├── node_modules/           
│   ├── src/                    
│   ├── .env                    
│   ├── index.html              
│   ├── package.json           
│   ├── tailwind.config.js     
│   ├── tsconfig.json          
│   └── vite.config.ts         
└── terraform/                  
    ├── buildspec.yml          
    ├── codepipeline.tf       
    ├── connect.sh           
    ├── ec2.tf                
    ├── load_balancer.tf      
    ├── main.tf              
    ├── outputs.tf           
    ├── PROJECT-FILES.md     
    ├── rds.tf              
    ├── security_group.tf   
    └── terraform.tfstate   
├── package-lock.json
├── package.json
├── README.md    
```

##  Getting Started

### **1. Clone the repository**
```bash
git clone <repository-url>
cd HEALTH-TRACKER-APP
```

2. Backend Setup
```bash
cd app
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Frontend Setup
```bash
cd ../frontend
npm install
```

Infrastructure Deployment


Terraform Setup

Initialize Terraform:
``bash
cd terraform
terraform init

Review Plan:
terraform plan

Deploy Infrastructure:
terraform apply -auto-approve


