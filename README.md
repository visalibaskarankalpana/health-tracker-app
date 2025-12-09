Health Tracker Application - Cloud Deployment
🔧 Technology Stack Badges

<div align="center">
🚀 Core Technologies

https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white
https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white
https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white

🎨 Frontend

https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white

🗄️ Databases

https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white
https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
https://img.shields.io/badge/Amazon_RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white

☁️ AWS Services

https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white
https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white
https://img.shields.io/badge/Amazon_CloudWatch-FF4F8B?style=for-the-badge&logo=amazoncloudwatch&logoColor=white
https://img.shields.io/badge/CodePipeline-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white
https://img.shields.io/badge/CodeBuild-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white

🛠️ DevOps

https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white
https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
https://img.shields.io/badge/CI/CD-FF6B6B?style=for-the-badge&logo=githubactions&logoColor=white

📊 Status

https://img.shields.io/badge/Status-Operational-success?style=for-the-badge
https://img.shields.io/badge/HIPAA_Compliant-4CAF50?style=for-the-badge&logo=healthicons&logoColor=white
https://img.shields.io/badge/License-Educational-blue?style=for-the-badge

📚 Education

https://img.shields.io/badge/EPITA-003366?style=for-the-badge&logo=university&logoColor=white
https://img.shields.io/badge/Cloud_Computing-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white

</div>
📋 Project Overview

Health Tracker Application is a comprehensive healthcare management system deployed on AWS cloud infrastructure. This project implements a modern healthcare platform with telemedicine capabilities, patient data management, and secure cloud architecture, fully provisioned using Terraform and CI/CD pipelines.


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

Review Plan:
terraform plan

Deploy Infrastructure:
terraform apply -auto-approve
```
