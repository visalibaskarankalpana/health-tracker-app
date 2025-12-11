Health Tracker Application - Cloud Deployment

![Terraform](https://img.shields.io/badge/Terraform-7B42BC)
![AWS](https://img.shields.io/badge/AWS-FF9900)
![Python](https://img.shields.io/badge/Python-3776AB)
![Node.js](https://img.shields.io/badge/Node.js-339933)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC)
![Vite](https://img.shields.io/badge/Vite-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1)
![EC2](https://img.shields.io/badge/EC2-FF9900)
![S3](https://img.shields.io/badge/S3-569A31)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF)
![License](https://img.shields.io/badge/License-MIT-green)


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

## Infrastructure Deployment

### ** Terraform Setup

Initialize Terraform:

```bash
cd terraform
terraform init
```
```bash
Review Plan:
terraform plan
```
```bash
Deploy Infrastructure:
terraform apply -auto-approve
```
