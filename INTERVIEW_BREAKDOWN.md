# BudgetBuddy DevOps Project - Interview Breakdown

---

## 1. DEVOPS TOOLS & TECHNOLOGIES

### **CI/CD Pipeline**
- **Jenkins** (Local)
  - Triggered by GitHub webhooks via ngrok tunnel
  - Automates: checkout → build → push → deploy cycle
  - No manual intervention needed after git push

- **ngrok**
  - Exposes local Jenkins to internet (HTTPS tunnel)
  - Webhook bridge between GitHub and local Jenkins
  - Why: Can't run Jenkins on AWS free tier; ngrok solves this

### **Container & Orchestration**
- **Docker** - Package application + dependencies into containers
- **Docker Compose** - Orchestrate 3 services (Frontend, Backend, MongoDB)
- **Docker Hub** - Central image registry for storage + distribution

### **Infrastructure as Code (IaC)**
- **Terraform** - AWS provider (~5.x)
  - Provisions: EC2 instance (t3.micro), VPC, Security Groups, Networking
  - Why: Reproducible infrastructure, version controlled, easy teardown

### **Configuration Management**
- **Ansible** - Automate server setup & deployment
  - Tasks: Install Docker, pull images, start services, health checks
  - Why: Idempotent, reusable playbooks, no agent needed on EC2

### **Version Control**
- **GitHub** - Codebase + automated webhook triggers
- **Git SHA tagging** - Every build tagged with commit short hash (e.g., `8ca2fc9c`)
  - Why: Prevents stale image deployments, full traceability

---

## 2. BASIC ARCHITECTURE

### **High-Level Flow**
```
Developer Push → GitHub → Webhook → ngrok → Jenkins
                                              ↓
                                        Build Docker Images
                                              ↓
                                        Push to Docker Hub
                                              ↓
                                        SSH → Ansible on EC2
                                              ↓
                                        Pull Images, Start Services
                                              ↓
                                        AWS EC2 Running App
```

### **Application Layers**

**Frontend (React 18.2)**
- Runs on Nginx:8081
- Tailwind CSS for styling
- React Router for pages (Login, SignUp, HomePage, etc.)
- Makes API calls to Backend

**Backend (Node.js + Express 5.1)**
- Runs on Port 5000
- RESTful API with controllers (auth, transactions, goals, settings)
- Middleware: JWT authentication, error handling
- Routes: `/api/auth`, `/api/transactions`, `/api/goals`, `/api/settings`, `/api/health`

**Database (MongoDB 7)**
- Runs on Port 27017
- Collections: users, transactions, goals, settings
- Persists all application data

### **Infrastructure (AWS EC2)**
- Type: t3.micro (free tier)
- Region: ap-south-1 (Mumbai)
- OS: Amazon Linux 2
- IP: 15.206.124.163
- Ports Exposed: 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (API), 8081 (Frontend), 27017 (MongoDB)

---

## 3. AUTHENTICATION & SECURITY

### **Authentication**
- **JWT (JSON Web Tokens)**
  - User login → Backend validates credentials → Issues JWT token
  - Frontend stores token in localStorage
  - Every API request includes `Authorization: Bearer {token}`
  - Backend verifies token signature before processing request
  - Why JWT: Stateless, scalable, no session storage needed

### **Password Security**
- **bcryptjs** - Hash passwords before storing in MongoDB
  - Cost factor: bcrypt automatically hashes with salt
  - User password NEVER stored in plaintext

### **API Security**
- **authMiddleware.js** - Validates JWT on protected routes
  - Rejects requests without valid token
  - Returns 401 Unauthorized for invalid/expired tokens
- **CORS enabled** - Backend accepts requests only from frontend origin
- **Environment variables** - Secrets (JWT_SECRET, MONGO_URI) stored in .env, not in code

### **Network Security**
- **AWS Security Groups**
  - SSH (22): Only from your IP
  - HTTP (80): Open to all (for frontend)
  - API (5000): Open to all (backend)
  - MongoDB (27017): Only internal (docker network, not exposed to internet)
  
- **SSH Key-Based Auth**
  - EC2 accessible ONLY via SSH key pair
  - No password login to EC2
  - Jenkins uses private key stored securely as credential

### **Data Protection**
- MongoDB runs in private Docker network (not exposed to internet)
- Only Backend container can access MongoDB
- Frontend → Backend → MongoDB (layered access)

### **Secret Management**
- Docker Hub credentials
- EC2 SSH private key
- MongoDB URI
- JWT secret
- All stored in Jenkins credentials store (encrypted)

---

## 4. KEY DESIGN DECISIONS & WHY

### **Why Jenkins (Local) Instead of GitHub Actions?**
- ✅ GitHub Actions free tier has limited minutes
- ✅ Building Docker images on t3.micro EC2 (1GB RAM) would fail/be slow
- ✅ Local machine has more resources to build
- ✅ ngrok tunnel enables webhook automation without exposing local network

### **Why Separate Build & Deploy**
- ✅ Jenkins builds images on local machine (fast, resources available)
- ✅ Docker Hub stores images (central registry)
- ✅ EC2 only pulls & runs (lightweight, stable)
- ✅ Scales better when adding more servers

### **Why Git SHA Tagging?**
- Problem: Using only `:latest` tag → Docker caches old image locally
- Solution: Each commit tagged with unique SHA → Forces fresh pull
- Result: Always deploying exact version that matches git commit

### **Why Docker Compose on EC2 (Not Kubernetes)?**
- ✅ Learning project, not production scale
- ✅ Docker Compose simpler to manage on t3.micro
- ✅ Kubernetes adds complexity without benefit here
- ✅ Easy to migrate to K8s later if needed

### **Why Terraform + Ansible (Not just CloudFormation)?**
- ✅ Terraform: Cloud-agnostic (works with AWS, Azure, GCP)
- ✅ Ansible: Runs on any OS, easy to extend
- ✅ Both: Industry standard DevOps tools
- ✅ Better for learning & portability

### **Why Ngrok (Not port-forward)?**
- ✅ GitHub requires HTTPS webhook URLs
- ✅ Ngrok provides stable HTTPS tunnel to local Jenkins
- ✅ Much safer than exposing Jenkins directly to internet

---

## 5. WHAT I LEARNED (Great Interview Answer!)

1. **End-to-End Automation**: CI/CD from git push → production in ~5 minutes
2. **Infrastructure Reliability**: Immutable containers + IaC = reproducible deployments
3. **Security by Design**: Layered access, JWT auth, encrypted secrets, no hardcoded credentials
4. **Resource Optimization**: Separating build (local) from deploy (EC2) for efficiency on t3.micro
5. **Troubleshooting**: Fixed stale image deployments, disk space issues, DNS webhook problems
6. **DevOps Culture**: Automation > Manual ops, version everything, monitor health

---

## 6. QUICK ANSWERS FOR TOUGH QUESTIONS

**Q: Why not use GitHub Actions only?**
A: Free tier limits + building on t3.micro would be slow/fail. Local build + ngrok webhook gives us unlimited automation.

**Q: How do you prevent stale deployments?**
A: Git SHA tagging. Each commit gets unique image tag (8ca2fc9c) → Forces Docker to pull fresh, no caching issues.

**Q: Is your MongoDB secure?**
A: Yes. Runs in private Docker network, only accessible from Backend container. Not exposed to internet. Credentials in .env file.

**Q: What happens if EC2 runs out of disk?**
A: Ansible health check fails early & reports "Need 1GB free space". I added auto-cleanup of old Docker images + prune tasks before pull.

**Q: Why not use RDS instead of MongoDB in container?**
A: This is a learning project focusing on DevOps automation. Containerized MongoDB teaches more about orchestration than managed services.

**Q: How do you handle database backups?**
A: Currently: MongoDB data persists in Docker volume. Future: Could use AWS S3 for backup snapshots or MongoDB Atlas managed backups.

**Q: What's your deployment rollback strategy?**
A: Docker images tagged by git SHA → Can redeploy old SHA by updating `image_tag` in Ansible. Git history = full change audit trail.

**Q: How do you monitor the application?**
A: Health check endpoint (`/api/health`). Ansible verify backend responds. Future: Could add Prometheus + Grafana for metrics.

---

## 7. TELL ME ABOUT YOUR PROJECT - SAMPLE ANSWER (90 seconds)

*"I built BudgetBuddy, a full-stack expense tracking app using React, Node.js, and MongoDB. But the real learning was in the DevOps automation.*

*I designed an end-to-end CI/CD pipeline: Developer pushes to GitHub → Jenkins builds Docker images on my local machine → Pushes to Docker Hub → Deploys to AWS EC2 via Ansible. This takes ~5 minutes, fully automated.*

*Why this architecture? EC2 t3.micro can't build images reliably, so I keep build on local machine (ngrok tunnel handles webhook automation) and EC2 just pulls & runs. I use Git SHA-based image tagging to prevent stale deployments—a real problem I debugged.*

*For infrastructure, Terraform provisions EC2 + networking, then Ansible installs Docker and deploys services. Security-wise: JWT auth, bcrypt password hashing, SSH key-only EC2 access, and private MongoDB (not exposed to internet).*

*I hit real production problems—disk space during pulls, stale image caches, webhook timeouts—and solved them. That debugging experience taught me more than the happy path ever could."*

---

**Good luck tomorrow!** 🚀
