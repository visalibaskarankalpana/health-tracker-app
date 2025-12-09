# Copy this file to terraform.tfvars and fill in your values

# AWS Configuration
aws_region = "us-east-2"

# Project Configuration
project_name = "healthcare"
environment  = "dev"

# Network Configuration (minimal setup - 2 public + 2 private in 2 AZs for ALB and RDS requirements)
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]  # ALB requires 2 subnets in different AZs
private_subnet_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]  # RDS requires 2 subnets in different AZs

# Database Configuration
db_password = "YourSecurePassword12"

# EC2 Configuration (optional - uncomment and set if you have a key pair)
# key_pair_name = "your-existing-key-pair-name"

# GitHub Configuration for CodePipeline
github_repo_owner = "visalibaskarankalpana"
github_repo_name  = "health-tracker-app"
github_branch     = "main"

# Optional: Restrict access to your IP
# allowed_cidr_blocks = ["YOUR_IP/32"]

# Backend port for Python application
backend_port = 8000

# Optional: Custom instance types
# instance_type = "t2.micro"
# db_instance_class = "db.t3.micro"
