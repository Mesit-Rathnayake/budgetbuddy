# 🚀 BudgetBuddy - Full-Stack DevOps Project

A comprehensive DevOps implementation demonstrating CI/CD pipelines, Infrastructure as Code, configuration management, and containerization for a full-stack budget tracking application.

**Live Application:** http://15.206.124.163:8081  
**API Endpoint:** http://15.206.124.163:5000

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Quick Start](#quick-start)
- [Deployment Options](#deployment-options)
- [Project Structure](#project-structure)
- [CI/CD Pipeline](#cicd-pipeline)
- [Infrastructure as Code](#infrastructure-as-code)
- [Monitoring & Health Checks](#monitoring--health-checks)

---

## 🌟 Project Overview

BudgetBuddy is a personal finance tracking application built to demonstrate modern DevOps practices and tools. The project showcases end-to-end automation from development to production deployment on AWS infrastructure.

### Key Objectives
- Implement automated CI/CD pipelines
- Deploy infrastructure using Terraform
- Automate configuration management with Ansible
- Containerize applications using Docker
- Orchestrate containers with Kubernetes
- Monitor application health and performance

---

## 🛠️ Technology Stack

### Application Layer
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React.js, Tailwind CSS | User interface and client-side logic |
| **Backend** | Node.js, Express.js | RESTful API and business logic |
| **Database** | MongoDB 7 | Data persistence |
| **Authentication** | JWT | Secure user authentication |

### DevOps Tools
| Tool | Purpose | Implementation |
|------|---------|----------------|
| **Docker** | Containerization | Multi-stage builds for frontend/backend |
| **Docker Compose** | Container orchestration | Multi-container application management |
| **Docker Hub** | Image storage | Docker Hub for built Docker image storage |
| **Terraform** | Infrastructure as Code | AWS EC2, VPC, Security Groups provisioning |
| **Ansible** | Configuration Management | Automated deployment and server setup |
| **Jenkins** | CI/CD Pipeline | Build images, push to Docker Hub, trigger deploy |
| **Ngrok** | Webhook tunnel | Expose local Jenkins to GitHub webhooks |
| **Kubernetes** | Container Orchestration | Production-grade container management |
| **Git/GitHub** | Version Control | Source code management |

### Cloud Infrastructure
- **Provider:** AWS (Amazon Web Services)
- **Region:** ap-south-1 (Mumbai)
- **Instance Type:** t3.micro (free tier eligible)
- **OS:** Amazon Linux 2
- **Build System:** Jenkins (local) + Docker Hub

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│                  (Version Control)                          │
└─────────────┬───────────────────────────────────────────────┘
              │ Push to main branch
              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Jenkins (Local)                          │
│              (CI/CD Pipeline Automation)                    │
│  • Build Docker images                                      │
│  • Push to Docker Hub                                       │
│  • Deploy via Ansible                                       │
└─────────────┬───────────────────────────────────────────────┘
              │ SSH Connection
              ▼
┌─────────────────────────────────────────────────────────────┐
│            AWS EC2 Instance (15.206.124.163)                │
│                    t3.micro - Amazon Linux 2                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Docker Compose Environment                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │   Frontend   │  │   Backend    │  │  MongoDB   │  │  │
│  │  │   (Nginx)    │  │  (Node.js)   │  │  Database  │  │  │
│  │  │   Port 8081  │  │   Port 5000  │  │ Port 27017 │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      End Users                              │
│              (Browser Access via HTTP)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Application Features
- 🔐 **User Authentication** - Secure JWT-based authentication
- 💰 **Expense Tracking** - Add, edit, delete transactions
- 🎯 **Budget Goals** - Set and track financial goals
- 📊 **Visual Reports** - Charts and analytics dashboard
- 👤 **Profile Management** - User settings and preferences
- 🏥 **Health Checks** - Application health monitoring

### DevOps Features
- 🔄 **Automated CI/CD** - Push to deploy workflow
- 🏗️ **Infrastructure as Code** - Reproducible infrastructure
- 🤖 **Configuration Management** - Automated server setup
- 📦 **Containerization** - Consistent environments
- 🔍 **Health Monitoring** - Automated health checks
- 🛡️ **Security** - Hardened security groups and configurations

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- AWS Account (for deployment)
- Terraform (for infrastructure)
- Ansible (for configuration)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Mesit-Rathnayake/budgetbuddy.git
cd budgetbuddy
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:8081
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Production Deployment

See [deployment options](#deployment-options) below.

---

## 🚢 Deployment Options

### Option 1: GitHub Actions (Automated)

Simply push to the `main` branch:
```bash
git push origin main
```

The GitHub Actions workflow automatically:
1. Installs Ansible and dependencies
2. Deploys to EC2 using Ansible playbook
3. Rebuilds containers with latest code

### Option 2: Terraform + Ansible (Manual)

**Step 1: Provision Infrastructure**
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

**Step 2: Deploy Application**
```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

### Option 3: Kubernetes (Container Orchestration)

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

### Option 4: Jenkins (CI/CD Pipeline)

Configure Jenkins with the provided `Jenkinsfile` for automated:
- Build
- Test
- Deploy
- Health check

---

## 📁 Project Structure

```
budgetbuddy/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── ansible/
│   ├── deploy.yml              # Deployment playbook
│   ├── health-check.yml        # Health check playbook
│   ├── inventory.ini           # Server inventory
│   └── templates/              # Configuration templates
├── back/
│   ├── Dockerfile              # Backend container image
│   ├── server.js               # Express server
│   ├── controllers/            # API controllers
│   ├── models/                 # MongoDB models
│   └── routes/                 # API routes
├── front/
│   ├── Dockerfile              # Frontend container image
│   ├── nginx.conf              # Nginx configuration
│   ├── src/
│   │   ├── components/         # React components
│   │   └── pages/              # Application pages
│   └── build/                  # Production build
├── k8s/
│   ├── namespace.yaml          # Kubernetes namespace
│   ├── secrets.yaml            # Application secrets
│   ├── mongodb.yaml            # MongoDB deployment
│   ├── backend.yaml            # Backend deployment
│   ├── frontend.yaml           # Frontend deployment
│   └── ingress.yaml            # Ingress configuration
├── terraform/
│   ├── main.tf                 # Main infrastructure
│   ├── versions.tf             # Provider versions
│   ├── outputs.tf              # Output values
│   └── terraform.tfvars        # Variable values
├── docker-compose.yml          # Local development
├── Jenkinsfile                 # Jenkins pipeline
├── .dockerignore               # Docker build exclusions
├── .gitignore                  # Git exclusions
└── README.md                   # This file
```

---

## 🔄 CI/CD Pipeline

### Jenkins Workflow (Local + Fully Automated)

The pipeline now runs in **local Jenkins** and uses **Docker Hub** for image storage. GitHub webhooks trigger Jenkins automatically via **ngrok**.

**Workflow Overview:**

```
Push to main branch
  ↓
GitHub Webhook -> ngrok -> Jenkins
  ↓
Jenkins Pipeline
├─ Build backend Docker image
├─ Build frontend Docker image
├─ Tag images with git SHA + latest
├─ Push images to Docker Hub
└─ Deploy to EC2 via Ansible
  ↓
EC2 pulls SHA-tagged images and restarts services
```

**Key Components:**

1. **Jenkinsfile** - Primary CI/CD pipeline
   - Triggered by GitHub webhook
   - Builds backend + frontend images
   - Tags images with git SHA and `latest`
   - Pushes to Docker Hub (`mesith30/*`)
   - Runs Ansible deploy on EC2

2. **ngrok** - Webhook tunnel
   - Exposes local Jenkins to GitHub
   - Webhook URL: `https://<ngrok-id>.ngrok-free.dev/github-webhook/`

3. **Ansible deploy**
   - Pulls exact image tag via `IMAGE_TAG`
   - Recreates containers to avoid stale images

**Total Deployment Time:** ~5 minutes (build + push + deploy)

### Why This Approach?

The t3.micro instance (1GB RAM) cannot build Docker images reliably. This setup keeps EC2 lightweight and stable:
- **Jenkins**: Build and push on local machine
- **Docker Hub**: Image registry
- **EC2**: Pull and run only
- **Result**: Stable, fully automated pipeline

### Deployment Verification

After each deployment:
- Frontend: http://15.206.124.163:8081
- Backend: http://15.206.124.163:5000
- Health Check: http://15.206.124.163:5000/api/health

---

## 📦 Docker Image Management

### Docker Hub

**Images Published:**
- `mesith30/budgetbuddy-backend:latest` and `mesith30/budgetbuddy-backend:<git-sha>`
- `mesith30/budgetbuddy-frontend:latest` and `mesith30/budgetbuddy-frontend:<git-sha>`

**Image Access:**
- Public images on Docker Hub
- Automatically built and pushed by Jenkins

**Local Image Building (if needed):**
```bash
# Build specific images
docker build -t mesith30/budgetbuddy-backend:latest ./back
docker build -t mesith30/budgetbuddy-frontend:latest ./front

# Or use docker-compose
docker-compose build --no-cache
```

---

## 🏗️ Infrastructure as Code

### Terraform Components

**Resources Provisioned:**
- AWS VPC and Subnets
- Security Groups (SSH, HTTP, Custom ports)
- EC2 Instance (t3.micro - free tier)
- Elastic IP (optional)
- IAM roles and policies

**Key Features:**
- Automated Docker installation
- Application auto-start on boot
- Systemd service configuration
- Security hardening

### Ansible Playbooks

**deploy.yml** - Full application deployment
- Install dependencies (Docker, Docker Compose, Python)
- Clone/update repository from GitHub
- Configure environment variables (.env)
- **Pull exact image tag from Docker Hub** (no local build)
- Start Docker Compose services with `IMAGE_TAG`
- Run health checks
- Setup systemd service for auto-restart

**health-check.yml** - Application health monitoring
- Check container status
- Verify service endpoints
- Test database connectivity
- Generate health report

---

## 🏥 Monitoring & Health Checks

### Health Check Endpoints

- **Backend Health:** http://15.206.124.163:5000/api/health
- **Frontend:** http://15.206.124.163:8081

### Container Health Checks

**MongoDB:**
```yaml
healthcheck:
  test: mongosh --eval "db.adminCommand({ ping: 1 })"
  interval: 30s
  timeout: 10s
  retries: 3
```

**Backend:**
```yaml
healthcheck:
  test: wget -q --spider http://localhost:5000/api/health
  interval: 30s
  timeout: 10s
  retries: 3
```

### Manual Health Check

```bash
ansible-playbook -i ansible/inventory.ini ansible/health-check.yml
```

---

## 🔒 Security Considerations

- ✅ JWT-based authentication
- ✅ Environment variables for secrets
- ✅ Security groups with minimal port exposure
- ✅ SSH key-based authentication only
- ✅ Docker containers run as non-root users
- ✅ HTTPS ready (Nginx configured)
- ✅ MongoDB authentication enabled in production

---

## 📝 Environment Variables

Create `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://mongo:27017/budget-tracker

# Authentication
JWT_SECRET=your_secret_key_here

# Application
NODE_ENV=production
PORT=5000

# Frontend
REACT_APP_BACKEND_URL=http://15.206.124.163:5000
FRONTEND_PORT=8081
```

---

## 🧪 Testing

### Run Tests Locally

**Backend:**
```bash
cd back
npm test
```

**Frontend:**
```bash
cd front
npm test
```

### Test in Docker

```bash
docker-compose run backend npm test
docker-compose run frontend npm test
```

---

## 📊 Project Metrics

- **Lines of Code:** ~5,000+
- **Docker Images:** 3 (Frontend, Backend, MongoDB)
- **Kubernetes Resources:** 6 YAML files
- **Ansible Playbooks:** 2
- **Terraform Resources:** 10+
- **API Endpoints:** 15+
- **React Components:** 12+

---

## 🤝 Contributing

This is an educational project demonstrating DevOps practices. Feel free to fork and enhance!

---

## 👨‍💻 Author

**Rathnayake R.M.S**  
Index No: EG/2022/5440  
Project: BudgetBuddy DevOps Implementation

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- ✅ CI/CD pipeline implementation
- ✅ Infrastructure as Code (Terraform)
- ✅ Configuration Management (Ansible)
- ✅ Container orchestration (Docker, Kubernetes)
- ✅ Cloud deployment (AWS)
- ✅ Full-stack application development
- ✅ DevOps best practices and automation

---

**Last Updated:** January 28, 2026  
**Repository:** https://github.com/Mesit-Rathnayake/budgetbuddy.git
