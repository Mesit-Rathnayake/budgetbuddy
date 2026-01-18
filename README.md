# 🚀 BudgetBuddy DevOps Project

A comprehensive DevOps implementation showcasing CI/CD, Infrastructure as Code (IaC), configuration management, and container orchestration for a full-stack budget tracking application.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Deployment Options](#deployment-options)
- [Author](#author)

## 🌟 Overview

BudgetBuddy is a full-stack web application for personal finance tracking, demonstrating modern DevOps practices:

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **DevOps**: Jenkins, Terraform, Ansible, Kubernetes, Docker

## 🛠️ Technologies

### Application Stack
- React.js
- Node.js & Express
- MongoDB 7
- Docker & Docker Compose

### DevOps Tools
- **CI/CD**: Jenkins
- **IaC**: Terraform (AWS)
- **Configuration Management**: Ansible
- **Orchestration**: Kubernetes
- **Version Control**: Git/GitHub

## ✨ Features

### Application Features
- ✅ User authentication (JWT)
- ✅ Expense tracking
- ✅ Budget goal setting
- ✅ Visual reports and analytics
- ✅ User profile management

### DevOps Features
- ✅ Automated CI/CD pipeline with Jenkins
- ✅ Infrastructure as Code with Terraform
- ✅ Configuration management with Ansible
- ✅ Container orchestration with Kubernetes
- ✅ Multi-stage Docker builds
- ✅ Health checks and monitoring
- ✅ Horizontal scaling capability
- ✅ Automated deployments

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/Mesit-Rathnayake/budgetbuddy.git
cd budgetbuddy

# Create environment file
echo "JWT_SECRET=your-secret-key" > .env

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:8081
# Backend API: http://localhost:5000
```

That's it! 🎉

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command cheatsheet
- **[Jenkinsfile](Jenkinsfile)** - CI/CD pipeline definition
- **[docker-compose.yml](docker-compose.yml)** - Local orchestration

## 📁 Project Structure

```
budgetbuddy/
├── back/                   # Backend API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── Dockerfile
├── front/                  # Frontend React app
│   ├── src/
│   └── Dockerfile
├── ansible/               # Configuration Management
│   ├── deploy.yml
│   ├── health-check.yml
│   └── inventory.ini
├── k8s/                   # Kubernetes Manifests
│   ├── namespace.yaml
│   ├── mongodb.yaml
│   ├── backend.yaml
│   └── frontend.yaml
├── docker-compose.yml     # Local development
├── Jenkinsfile           # CI/CD pipeline
├── main.tf               # Terraform IaC
└── README.md
```

## 🌐 Deployment Options

### 1️⃣ Docker Compose (Local)
```bash
docker-compose up -d
```
**Best for**: Local development and testing

### 2️⃣ Terraform (AWS)
```bash
terraform init
terraform apply
```
**Best for**: Cloud infrastructure provisioning

### 3️⃣ Ansible (Configuration Management)
```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```
**Best for**: Server configuration and application deployment

### 4️⃣ Kubernetes (Orchestration)
```bash
kubectl apply -f k8s/
```
**Best for**: Production-grade container orchestration

### 5️⃣ Jenkins (CI/CD)
Automated pipeline triggered on git push
**Best for**: Continuous integration and deployment

## 🎯 Use Cases

This project demonstrates:

- ✅ **CI/CD Pipeline**: Automated builds and deployments
- ✅ **Infrastructure as Code**: Version-controlled infrastructure
- ✅ **Configuration Management**: Automated server configuration
- ✅ **Container Orchestration**: Scalable containerized applications
- ✅ **Multi-environment Deployment**: Dev, staging, production
- ✅ **Security Best Practices**: Secrets management, least privilege
- ✅ **Monitoring & Health Checks**: Application observability
- ✅ **Disaster Recovery**: Backup and restore procedures

## 🏗️ Architecture

```
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼──┐   ┌──▼───┐
│ Front│   │ Back │
│ end  │◄──┤ end  │
└──────┘   └──┬───┘
              │
         ┌────▼────┐
         │ MongoDB │
         └─────────┘
```

## 📊 Monitoring

### Health Check Endpoints
- Backend: `http://localhost:5000/api/health`
- Frontend: `http://localhost:8081`

### View Logs
```bash
# Docker Compose
docker-compose logs -f

# Kubernetes
kubectl logs -f <pod-name> -n budgetbuddy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mesith Rathnayake**
- GitHub: [@Mesit-Rathnayake](https://github.com/Mesit-Rathnayake)
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]

## 🙏 Acknowledgments

- DevOps community for best practices
- Open source contributors
- Docker, Kubernetes, Terraform, and Ansible teams

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for troubleshooting
- Refer to [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ by Mesith Rathnayake
