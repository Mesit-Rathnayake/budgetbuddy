# BudgetBuddy - DevOps Implementation

## 📋 Project Overview

BudgetBuddy is a full-stack budget tracking application demonstrating modern DevOps practices including CI/CD, Infrastructure as Code (IaC), configuration management, and container orchestration.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┴──────────┐
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│   Frontend      │    │    Backend      │
│   (React)       │◄───┤   (Node.js)     │
│   Port: 8081    │    │   Port: 5000    │
└─────────────────┘    └────────┬────────┘
                                │
                       ┌────────▼────────┐
                       │    MongoDB      │
                       │   Port: 27017   │
                       └─────────────────┘
```

## 🛠️ Technology Stack

### Application Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB 7
- **Containerization**: Docker & Docker Compose

### DevOps Tools
- **CI/CD**: Jenkins
- **IaC**: Terraform
- **Configuration Management**: Ansible
- **Orchestration**: Kubernetes (K8s)
- **Version Control**: Git/GitHub

## 📁 Project Structure

```
.
├── back/                    # Backend API (Node.js)
│   ├── controllers/         # API controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── Dockerfile          # Backend container image
│
├── front/                   # Frontend (React)
│   ├── src/
│   │   ├── components/     # React components
│   │   └── pages/          # Application pages
│   └── Dockerfile          # Frontend container image
│
├── ansible/                 # Configuration Management
│   ├── deploy.yml          # Deployment playbook
│   ├── health-check.yml    # Health monitoring playbook
│   ├── inventory.ini       # Server inventory
│   └── templates/          # Configuration templates
│
├── k8s/                    # Kubernetes Manifests
│   ├── namespace.yaml      # K8s namespace
│   ├── mongodb.yaml        # MongoDB deployment
│   ├── backend.yaml        # Backend deployment
│   ├── frontend.yaml       # Frontend deployment
│   └── ingress.yaml        # Ingress configuration
│
├── docker-compose.yml      # Local Docker orchestration
├── Jenkinsfile            # CI/CD pipeline definition
├── main.tf                # Terraform main configuration
├── versions.tf            # Terraform version constraints
└── outputs.tf             # Terraform outputs

```

## 🚀 Deployment Options

### Option 1: Local Development with Docker Compose

```bash
# Clone the repository
git clone https://github.com/Mesit-Rathnayake/budgetbuddy.git
cd budgetbuddy

# Create environment file
echo "JWT_SECRET=your-secret-key" > .env
echo "FRONTEND_PORT=8081" >> .env

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Access application
# Frontend: http://localhost:8081
# Backend: http://localhost:5000
```

### Option 2: AWS Deployment with Terraform

#### Prerequisites
- AWS Account with appropriate permissions
- AWS CLI configured
- Terraform installed (>= 1.0)
- SSH key pair created in AWS EC2

#### Steps

```bash
# Initialize Terraform
terraform init

# Copy and configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars and set your values

# Plan deployment
terraform plan

# Deploy infrastructure
terraform apply

# Get deployment information
terraform output

# Access your application
# The output will show URLs for frontend, backend, and status page
```

### Option 3: Ansible Configuration Management

#### Prerequisites
- Ansible installed
- SSH access to target servers
- Python 3 on target servers

#### Steps

```bash
cd ansible

# Update inventory with your server IP
nano inventory.ini

# Test connectivity
ansible -i inventory.ini budgetbuddy -m ping

# Deploy application
ansible-playbook -i inventory.ini deploy.yml

# Run health checks
ansible-playbook -i inventory.ini health-check.yml

# Set JWT secret (optional)
ansible-playbook -i inventory.ini deploy.yml -e "jwt_secret=your-secure-secret"
```

### Option 4: Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS, or Minikube)
- kubectl configured
- Docker images pushed to registry

#### Steps

```bash
cd k8s

# Create namespace
kubectl apply -f namespace.yaml

# Update secrets with your values
kubectl apply -f secrets.yaml

# Deploy MongoDB
kubectl apply -f mongodb.yaml

# Deploy Backend
kubectl apply -f backend.yaml

# Deploy Frontend
kubectl apply -f frontend.yaml

# (Optional) Setup Ingress
kubectl apply -f ingress.yaml

# Check deployment status
kubectl get all -n budgetbuddy

# Get service URLs
kubectl get svc -n budgetbuddy

# View logs
kubectl logs -f deployment/backend -n budgetbuddy
kubectl logs -f deployment/frontend -n budgetbuddy

# Scale deployments
kubectl scale deployment backend --replicas=3 -n budgetbuddy
kubectl scale deployment frontend --replicas=3 -n budgetbuddy
```

## 🔄 CI/CD Pipeline (Jenkins)

The Jenkins pipeline automates the build and deployment process:

### Pipeline Stages

1. **Cleanup Old Containers**: Removes existing containers and volumes
2. **Build Docker Images**: Builds frontend and backend images
3. **Run Containers**: Starts the application stack
4. **Check Running Containers**: Verifies deployment

### Setup Jenkins Pipeline

```groovy
// In Jenkins:
1. Create New Item > Pipeline
2. Configure SCM: https://github.com/Mesit-Rathnayake/budgetbuddy.git
3. Script Path: Jenkinsfile
4. Save and Build
```

## 📊 Monitoring & Health Checks

### Docker Compose

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Check backend health
curl http://localhost:5000/api/health
```

### Ansible

```bash
# Run health check playbook
ansible-playbook -i inventory.ini health-check.yml
```

### Kubernetes

```bash
# Check pod status
kubectl get pods -n budgetbuddy

# View pod logs
kubectl logs -f <pod-name> -n budgetbuddy

# Port forward for local access
kubectl port-forward svc/frontend-service 8081:80 -n budgetbuddy
kubectl port-forward svc/backend-service 5000:5000 -n budgetbuddy

# Check resource usage
kubectl top pods -n budgetbuddy
kubectl top nodes
```

## 🔒 Security Best Practices

1. **Secrets Management**
   - Never commit `.env` files or secrets to Git
   - Use environment variables for sensitive data
   - Rotate JWT secrets regularly
   - Use Kubernetes secrets for K8s deployments

2. **Network Security**
   - Restrict SSH access in Terraform (update `allowed_ssh_cidr`)
   - Use security groups to limit port access
   - Enable HTTPS with SSL/TLS certificates

3. **Container Security**
   - Run containers as non-root users
   - Keep base images updated
   - Scan images for vulnerabilities

## 📈 Scaling

### Horizontal Scaling

**Docker Compose:**
```bash
docker-compose up -d --scale backend=3 --scale frontend=2
```

**Kubernetes:**
```bash
kubectl scale deployment backend --replicas=5 -n budgetbuddy
kubectl scale deployment frontend --replicas=3 -n budgetbuddy
```

### Vertical Scaling

Update resource limits in:
- `docker-compose.yml` for Docker
- Deployment YAML files for Kubernetes

## 🧪 Testing

```bash
# Backend API tests
cd back
npm test

# Frontend tests
cd front
npm test

# Integration tests
docker-compose up -d
npm run test:integration
```

## 🐛 Troubleshooting

### Issue: Containers not starting

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### Issue: MongoDB connection failed

```bash
# Check MongoDB logs
docker-compose logs mongo

# Verify MongoDB is healthy
docker exec myapp-mongo mongosh --eval "db.adminCommand({ ping: 1 })"
```

### Issue: Frontend can't connect to backend

```bash
# Check network connectivity
docker network inspect budgetbuddy-ci_default

# Verify backend is running
curl http://localhost:5000/api/health
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT tokens | `change_me` |
| `FRONTEND_PORT` | Frontend application port | `8081` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/budget-tracker` |
| `NODE_ENV` | Node.js environment | `production` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mesith Rathnayake**
- GitHub: [@Mesit-Rathnayake](https://github.com/Mesit-Rathnayake)

## 🙏 Acknowledgments

- DevOps best practices documentation
- Docker and Kubernetes communities
- AWS, Terraform, and Ansible documentation

---

**Note**: Remember to update secrets, domains, and configuration values for production deployments!
