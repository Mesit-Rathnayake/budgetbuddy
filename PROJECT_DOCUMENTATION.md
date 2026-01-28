# BudgetBuddy Application - Complete Project Documentation

## Executive Summary

This document provides a comprehensive breakdown of the BudgetBuddy application development and deployment lifecycle, detailing the technologies, tools, and methodologies employed at each stage. The project implements a full-stack web application with automated CI/CD pipeline, containerized architecture, and cloud-based infrastructure provisioning.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Development Phase](#development-phase)
3. [Containerization Strategy](#containerization-strategy)
4. [Infrastructure Provisioning](#infrastructure-provisioning)
5. [Configuration Management](#configuration-management)
6. [CI/CD Pipeline Implementation](#cicd-pipeline-implementation)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Implementation](#security-implementation)
9. [Monitoring and Health Checks](#monitoring-and-health-checks)
10. [Project Workflow](#project-workflow)

---

## Technology Stack

### Frontend Technologies
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | v18.2.0 | Component-based UI development |
| Build Tool | React Scripts (CRA) | v5.0.1 | Development server and production build |
| Routing | React Router DOM | v7.8.2 | Client-side routing and navigation |
| Styling | Tailwind CSS | v3.4.17 | Utility-first CSS framework |
| Icons | Lucide React | v0.268.0 | Icon library for UI components |
| Testing | @testing-library/react | v16.3.0 | Component testing framework |
| Testing | @testing-library/jest-dom | v6.8.0 | Custom Jest matchers for DOM |

### Backend Technologies
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | Latest (via Docker) | JavaScript runtime environment |
| Framework | Express.js | v5.1.0 | Web application framework |
| Database ODM | Mongoose | v8.18.1 | MongoDB object modeling |
| Authentication | jsonwebtoken | v9.0.2 | JWT-based user authentication |
| Password Security | bcryptjs | v3.0.2 | Password hashing and encryption |
| CORS | cors | v2.8.5 | Cross-Origin Resource Sharing |
| Development | nodemon | v3.1.10 | Auto-restart on code changes |

### Database
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Database System | MongoDB | v7 | NoSQL document database |
| Container Image | mongo:7 | Official | Docker containerized MongoDB |
| Shell | mongosh | Latest | Modern MongoDB shell |

### Web Server
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Web Server | Nginx | Latest (via Docker) | Static file serving and reverse proxy |

---

## Development Phase

### 1. Application Development

#### Frontend Development
- **Tool:** React v18.2.0
- **Build System:** Create React App (React Scripts v5.0.1)
- **Development Process:**
  - Component-based architecture for UI elements
  - Page components for routing (HomePage, LoginPage, ProfilePage, etc.)
  - Reusable components (Header, Footer)
  - State management with React hooks
  - API integration with backend services
  
**Key Files:**
- `front/src/App.js` - Main application component
- `front/src/pages/` - Page-level components
- `front/src/components/` - Reusable UI components
- `front/tailwind.config.js` - Tailwind CSS configuration

#### Backend Development
- **Tool:** Node.js with Express.js v5.1.0
- **Architecture:** RESTful API with MVC pattern
- **Development Process:**
  - Route definitions for API endpoints
  - Controller logic for business operations
  - Mongoose models for data schemas
  - Middleware for authentication and validation

**Key Files:**
- `back/server.js` - Application entry point
- `back/routes/` - API route definitions
- `back/controllers/` - Business logic handlers
- `back/models/` - MongoDB data schemas
- `back/middleware/` - Authentication and validation

#### Database Schema Design
- **Tool:** MongoDB v7 with Mongoose ODM
- **Collections:**
  - Users - User authentication and profile data
  - Transactions - Financial transaction records
  - Goals - User-defined financial goals
  - Settings - User preferences and configurations

### 2. Version Control Management

#### Source Control
- **Tool:** Git
- **Platform:** GitHub
- **Repository:** `github.com/Mesit-Rathnayake/budgetbuddy`
- **Branch Strategy:** Main branch for production-ready code

**Development Workflow:**
1. Local development on feature branches
2. Code review and testing
3. Merge to main branch
4. Automatic deployment triggered

---

## Containerization Strategy

### 3. Application Containerization

#### Docker Implementation
- **Container Engine:** Docker Engine (latest)
- **Orchestration Tool:** Docker Compose v2.24.7

#### Container Architecture

##### Frontend Container
- **Base Image:** Node.js for build, Nginx for serving
- **Dockerfile Location:** `front/Dockerfile`
- **Build Process:**
  1. Install dependencies (`npm ci`)
  2. Build React production bundle (`npm run build`)
  3. Copy build to Nginx container
  4. Configure Nginx for SPA routing
- **Exposed Port:** 80 (mapped to host 8081)
- **Environment Variables:**
  - `REACT_APP_BACKEND_URL` - Backend API endpoint

##### Backend Container
- **Base Image:** Node.js (official)
- **Dockerfile Location:** `back/Dockerfile`
- **Build Process:**
  1. Install production dependencies
  2. Copy application code
  3. Expose application port
  4. Set startup command (`node server.js`)
- **Exposed Port:** 5000
- **Environment Variables:**
  - `MONGO_URI` - MongoDB connection string
  - `JWT_SECRET` - Secret key for token signing
  - `NODE_ENV` - Environment mode (production)

##### Database Container
- **Base Image:** mongo:7 (official MongoDB image)
- **Data Persistence:** Named volume `mongo-data`
- **Volume Mount:** `/data/db`
- **Exposed Port:** 27017
- **Health Check:** `mongosh --eval "db.adminCommand({ ping: 1 })"`

#### Docker Compose Configuration
**File:** `docker-compose.yml`

**Services Defined:**
1. **mongo** - Database service with health checks
2. **backend** - API service dependent on MongoDB
3. **frontend** - Web interface service

**Key Features:**
- Service dependencies with health check conditions
- Named volumes for data persistence
- Custom network for inter-container communication
- Health checks for all services
- Restart policies for high availability

---

## Infrastructure Provisioning

### 4. Infrastructure as Code (IaC)

#### Terraform Implementation
- **Tool:** Terraform
- **Provider:** AWS Provider v5.100.0
- **Configuration File:** `main.tf`
- **Variables File:** `terraform.tfvars`

#### Provisioned Resources

##### Compute Resources
- **Resource Type:** AWS EC2 Instance
- **Instance Type:** t2.micro (Free Tier eligible)
- **AMI:** Amazon Linux 2 (latest)
- **Region:** ap-south-1 (Mumbai)
- **Instance ID:** i-09c75b907ffc0da58
- **Public IP:** 52.66.248.9 (dynamic)

##### Networking and Security
- **Security Group ID:** sg-0db756b90b8143bd1
- **Security Group Name:** budgetbuddy-sg

**Inbound Rules:**
| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | 0.0.0.0/0 | SSH access |
| 80 | TCP | 0.0.0.0/0 | HTTP traffic |
| 443 | TCP | 0.0.0.0/0 | HTTPS traffic |
| 5000 | TCP | 0.0.0.0/0 | Backend API |
| 8081 | TCP | 0.0.0.0/0 | Frontend application |
| 27017 | TCP | 0.0.0.0/0 | MongoDB (should be restricted) |

##### SSH Key Pair
- **Key Pair Name:** budgetbuddy-key
- **Private Key:** budgetbuddy-key.pem (600 permissions)
- **Location:** `~/budgetbuddy-key.pem` (WSL native filesystem)

#### Terraform Workflow
```bash
# Initialize Terraform
terraform init

# Preview infrastructure changes
terraform plan

# Apply infrastructure changes
terraform apply

# Destroy infrastructure (cleanup)
terraform destroy
```

#### User Data Script
The EC2 instance is bootstrapped with:
- Docker installation
- Git installation
- Python3 installation
- Docker Compose installation

---

## Configuration Management

### 5. Ansible Automation

#### Ansible Configuration
- **Tool:** Ansible v2.16+
- **Python Interpreter:** Python v3.9.18 (compiled from source)
- **Playbook:** `ansible/deploy.yml`
- **Inventory:** `ansible/inventory.ini`
- **Configuration:** `ansible/ansible.cfg`

#### Ansible Collections
- `community.docker` - Docker module support

#### Playbook Structure

##### Play 1: Bootstrap Python Environment
**Purpose:** Install Python 3.9.18 from source (Ansible 2.16+ requirement)

**Tasks:**
1. Check if Python 3.9 exists
2. Install compilation dependencies (gcc, openssl-devel, etc.)
3. Download Python 3.9.18 source
4. Configure with optimization flags
5. Compile and install to `/usr/local/bin/python3.9`
6. Create symbolic links

**Rationale:** Amazon Linux 2 ships with Python 3.7, but Ansible 2.16+ requires Python 3.9+

##### Play 2: Application Deployment
**Purpose:** Configure server and deploy application

**Task Categories:**

**System Configuration:**
- Update system packages via yum
- Install Docker and Git
- Install Docker SDK for Python
- Start and enable Docker service
- Add ec2-user to docker group

**Docker Compose Installation:**
- Download Docker Compose binary v2.24.7
- Install to `/usr/local/bin/docker-compose`
- Set executable permissions (0755)

**Application Setup:**
- Create application directory `/opt/budgetbuddy`
- Clone GitHub repository
- Create `.env` file from Jinja2 template
- Set proper file permissions

**Container Orchestration:**
- Stop existing containers
- Pull latest images
- Start services via `docker-compose up -d`

**Health Verification:**
- Wait for backend API health check
- Retry up to 30 times with 10-second intervals
- Verify endpoint: `http://localhost:5000/api/health`

**Service Management:**
- Create systemd service unit
- Enable service for auto-start on reboot
- Reload systemd daemon

#### Ansible Templates

##### Environment Variables Template
**File:** `ansible/templates/env.j2`

Variables configured:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Authentication secret key
- `FRONTEND_PORT` - Frontend port mapping
- `NODE_ENV` - Environment mode

##### Systemd Service Template
**File:** `ansible/templates/budgetbuddy.service.j2`

Ensures application starts automatically on system reboot

#### Ansible Execution
```bash
# Run playbook
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml

# Verbose mode
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml -vvv

# Check mode (dry run)
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml --check
```

---

## CI/CD Pipeline Implementation

### 6. Continuous Integration & Deployment

#### GitHub Actions Workflow
- **Workflow File:** `.github/workflows/deploy.yml`
- **Trigger:** Push to main branch
- **Runner:** ubuntu-latest (GitHub-hosted)
- **Execution Time:** ~5-8 minutes

#### Pipeline Stages

##### Stage 1: Code Checkout
- **Action:** `actions/checkout@v3`
- **Purpose:** Clone repository to runner environment

##### Stage 2: Python Environment Setup
- **Action:** `actions/setup-python@v4`
- **Python Version:** 3.x (latest)
- **Purpose:** Prepare Python runtime for Ansible

##### Stage 3: Ansible Installation
**Commands:**
```bash
python -m pip install --upgrade pip
pip install ansible
```
**Purpose:** Install Ansible automation tool

##### Stage 4: Ansible Collections
**Command:**
```bash
ansible-galaxy collection install community.docker
```
**Purpose:** Install Docker module support for Ansible

##### Stage 5: SSH Authentication
**Tasks:**
1. Create `.ssh` directory
2. Retrieve private key from GitHub Secrets (`EC2_SSH_KEY`)
3. Write key to `~/.ssh/budgetbuddy-key.pem`
4. Set permissions to 600 (security requirement)
5. Create symbolic link for compatibility

**Security:** Private keys stored securely in GitHub Secrets, never exposed in logs

##### Stage 6: Ansible Deployment
**Command:**
```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```
**Environment Variable:** `ANSIBLE_PRIVATE_KEY_FILE`
**Purpose:** Execute complete server configuration and deployment

##### Stage 7: Container Rebuild
**Command:**
```bash
ssh -i ~/.ssh/budgetbuddy-key.pem -o StrictHostKeyChecking=no ec2-user@52.66.248.9 \
  "cd /opt/budgetbuddy && docker-compose down && docker-compose up -d --build"
```
**Purpose:** Ensure containers use latest code changes

#### GitHub Secrets Configuration
- `EC2_SSH_KEY` - Private SSH key for EC2 access
- `JWT_SECRET` (optional) - JWT secret for production

#### Workflow Benefits
- **Automation:** Zero manual deployment steps
- **Consistency:** Identical deployment process every time
- **Speed:** Deployment completes in minutes
- **Rollback:** Git history enables quick reversion
- **Visibility:** GitHub Actions provides detailed logs

---

## Deployment Architecture

### 7. Production Environment

#### Application URL Structure
- **Frontend:** http://52.66.248.9:8081
- **Backend API:** http://52.66.248.9:5000
- **Health Check:** http://52.66.248.9:5000/api/health
- **Database:** Internal (mongo:27017 via Docker network)

#### Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AWS EC2 Instance                     │
│                  (52.66.248.9:t2.micro)                  │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           Docker Compose Network               │    │
│  │                                                 │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────┐ │    │
│  │  │  Frontend   │  │   Backend    │  │ Mongo │ │    │
│  │  │   (Nginx)   │  │  (Node.js)   │  │  DB   │ │    │
│  │  │   Port 80   │  │  Port 5000   │  │ 27017 │ │    │
│  │  └──────┬──────┘  └──────┬───────┘  └───┬───┘ │    │
│  │         │                 │              │     │    │
│  │         └─────────────────┴──────────────┘     │    │
│  │              Inter-container network           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Port Mappings:                                         │
│  - 8081:80  (Frontend)                                  │
│  - 5000:5000 (Backend API)                              │
│  - 27017:27017 (Database - should be internal only)     │
└─────────────────────────────────────────────────────────┘
```

#### Service Dependencies
```
Frontend → Backend → MongoDB
    ↓         ↓         ↓
  Nginx    Express   mongo:7
           Node.js
```

#### Data Flow
1. User accesses `http://52.66.248.9:8081` (Frontend)
2. React application loads in browser
3. Frontend makes API calls to `http://52.66.248.9:5000` (Backend)
4. Backend processes requests and queries MongoDB
5. Data returned through API to Frontend
6. Frontend displays data to user

---

## Security Implementation

### 8. Security Measures

#### Authentication & Authorization
- **Method:** JWT (JSON Web Tokens)
- **Library:** jsonwebtoken v9.0.2
- **Token Storage:** Client-side (localStorage or cookies)
- **Token Expiration:** Configured in backend

#### Password Security
- **Hashing Algorithm:** bcrypt
- **Library:** bcryptjs v3.0.2
- **Salt Rounds:** 10 (default)
- **Storage:** Hashed passwords in MongoDB

#### Network Security
- **SSH Access:** Key-based authentication only
- **Key Permissions:** 600 (read/write for owner only)
- **Security Group:** Firewall rules at AWS level
- **CORS:** Configured to accept specific origins

#### Secret Management
- **GitHub Secrets:** Sensitive credentials (SSH keys)
- **Environment Variables:** JWT secrets, DB credentials
- **File Permissions:** `.env` file set to 0600
- **No Hardcoding:** Secrets never committed to repository

#### Container Security
- **User Privileges:** Non-root user (ec2-user) added to docker group
- **Network Isolation:** Services communicate via Docker network
- **Image Sources:** Official and verified images only

#### Recommendations for Production
- [ ] Restrict MongoDB port (27017) to internal network only
- [ ] Implement HTTPS with SSL/TLS certificates
- [ ] Set up Nginx as reverse proxy for all services
- [ ] Configure firewall to accept specific IP ranges
- [ ] Enable AWS CloudWatch for monitoring
- [ ] Implement rate limiting on API endpoints
- [ ] Add Web Application Firewall (WAF)
- [ ] Regular security updates via `yum update`

---

## Monitoring and Health Checks

### 9. Service Monitoring

#### Docker Health Checks

##### MongoDB Health Check
```yaml
healthcheck:
  test: ["CMD", "mongosh", "--eval", "db.adminCommand({ ping: 1 })"]
  interval: 30s
  timeout: 10s
  retries: 3
```
**Purpose:** Verify database is accepting connections

##### Backend Health Check
```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:5000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```
**Purpose:** Verify API is responding to requests

#### Ansible Health Verification
**Check:** Wait for backend API
**Endpoint:** `http://localhost:5000/api/health`
**Method:** HTTP GET with uri module
**Retry Strategy:** 30 attempts with 10-second delay

#### Manual Verification Commands
```bash
# Check running containers
docker ps

# Check container logs
docker logs myapp-frontend
docker logs myapp-backend
docker logs myapp-mongo

# Check service status
systemctl status budgetbuddy

# Test API endpoint
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:8081
```

#### Systemd Service Management
**Service Name:** budgetbuddy.service
**Auto-start:** Enabled
**Purpose:** Automatic application startup on server reboot

---

## Project Workflow

### 10. End-to-End Development Lifecycle

#### Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Development                                        │
│ ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│ │   React     │  │  Node.js +   │  │   MongoDB    │       │
│ │ Frontend    │  │  Express.js  │  │   Database   │       │
│ │ Development │  │   Backend    │  │    Schema    │       │
│ └──────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
└────────┼─────────────────┼──────────────────┼──────────────┘
         │                 │                  │
         └─────────────────┴──────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Containerization                                   │
│ ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│ │   Docker    │  │    Docker    │  │    Docker    │       │
│ │  Frontend   │  │   Backend    │  │   Compose    │       │
│ │  Container  │  │   Container  │  │ Orchestration│       │
│ └──────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
└────────┼─────────────────┼──────────────────┼──────────────┘
         │                 │                  │
         └─────────────────┴──────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Version Control                                    │
│ ┌───────────────────────────────────────────────────┐      │
│ │  Git Commit → Push to GitHub (main branch)        │      │
│ └─────────────────────────┬─────────────────────────┘      │
└───────────────────────────┼────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Infrastructure Provisioning                        │
│ ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│ │  Terraform  │  │   AWS EC2    │  │   Security   │       │
│ │   Apply     │→ │   Instance   │→ │    Group     │       │
│ │             │  │   Creation   │  │  Configuration│       │
│ └─────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 5: CI/CD Pipeline (GitHub Actions)                    │
│ ┌──────────────────────────────────────────────────┐       │
│ │ 1. Checkout Code                                  │       │
│ │ 2. Setup Python + Install Ansible                │       │
│ │ 3. Configure SSH Authentication                  │       │
│ │ 4. Run Ansible Playbook                          │       │
│ │ 5. Rebuild Containers                            │       │
│ └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 6: Configuration Management (Ansible)                 │
│ ┌──────────────────────────────────────────────────┐       │
│ │ Bootstrap: Install Python 3.9                     │       │
│ │ Deploy: Install Docker + Docker Compose          │       │
│ │        Clone Repository                          │       │
│ │        Configure Environment                     │       │
│ │        Start Docker Compose Services             │       │
│ │        Verify Health Checks                      │       │
│ │        Enable Systemd Service                    │       │
│ └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 7: Production Deployment                              │
│ ┌──────────────────────────────────────────────────┐       │
│ │ Application Live at http://52.66.248.9:8081      │       │
│ │ API Available at http://52.66.248.9:5000         │       │
│ │ Containers: Frontend + Backend + MongoDB         │       │
│ │ Auto-restart: Systemd service enabled            │       │
│ └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

#### Step-by-Step Process

**Step 1: Application Development**
- Develop frontend with React
- Develop backend API with Node.js/Express
- Design database schema with Mongoose
- Test locally with `npm start`

**Step 2: Containerization**
- Create Dockerfiles for frontend and backend
- Write docker-compose.yml for orchestration
- Test containers locally with `docker-compose up`

**Step 3: Version Control**
- Initialize Git repository
- Commit all code changes
- Push to GitHub repository

**Step 4: Infrastructure Provisioning**
- Configure Terraform files (`main.tf`, `terraform.tfvars`)
- Run `terraform init` and `terraform apply`
- Note EC2 public IP address

**Step 5: Configuration Management**
- Create Ansible playbook (`deploy.yml`)
- Configure inventory file (`inventory.ini`)
- Create Jinja2 templates for environment files
- Test with `ansible-playbook` command

**Step 6: CI/CD Setup**
- Create GitHub Actions workflow file
- Add EC2 SSH key to GitHub Secrets
- Configure workflow to trigger on push
- Test automated deployment

**Step 7: Deployment & Verification**
- Push code to main branch
- GitHub Actions triggers automatically
- Ansible configures server and deploys app
- Verify application is accessible
- Check health endpoints

**Step 8: Ongoing Operations**
- Make code changes locally
- Commit and push to GitHub
- Automatic deployment occurs
- Monitor application health
- Review GitHub Actions logs

---

## Conclusion

This project demonstrates a complete DevOps workflow implementing:

✅ **Modern Development Practices:** React + Node.js + MongoDB stack  
✅ **Containerization:** Docker & Docker Compose for consistency  
✅ **Infrastructure as Code:** Terraform for reproducible infrastructure  
✅ **Configuration Management:** Ansible for automated server setup  
✅ **CI/CD Automation:** GitHub Actions for zero-touch deployment  
✅ **Cloud Deployment:** AWS EC2 for production hosting  
✅ **Security Best Practices:** JWT authentication, encrypted passwords, secret management  
✅ **Monitoring:** Health checks and systemd service management  

### Key Achievements
- **Zero Manual Deployment:** Every push automatically deploys
- **Reproducible Infrastructure:** Terraform enables consistent environments
- **Automated Configuration:** Ansible eliminates manual server setup
- **Containerized Architecture:** Docker ensures environment consistency
- **Production Ready:** Application accessible at public endpoint

### Future Enhancements
- [ ] Implement HTTPS with SSL/TLS certificates
- [ ] Add Nginx reverse proxy for unified endpoint
- [ ] Set up AWS CloudWatch monitoring
- [ ] Implement automated backups for MongoDB
- [ ] Add blue-green deployment strategy
- [ ] Implement Kubernetes for container orchestration
- [ ] Set up staging environment
- [ ] Add automated testing in CI/CD pipeline
- [ ] Implement log aggregation (ELK stack)
- [ ] Add performance monitoring (Prometheus + Grafana)

---

**Project Repository:** https://github.com/Mesit-Rathnayake/budgetbuddy  
**Production URL:** http://52.66.248.9:8081  
**Documentation Version:** 1.0  
**Last Updated:** January 2026
