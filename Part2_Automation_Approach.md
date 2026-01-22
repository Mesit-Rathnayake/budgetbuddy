# Part 2: Automation Approach - BudgetBuddy Application Deployment

## 1. DevOps Tools Used for Application Deployment

### 1.1 Version Control System
**Tool:** Git & GitHub  
**Version:** Git 2.x  
**Purpose:** Source code management and collaboration. GitHub serves as the central repository hosting platform and triggers the CI/CD pipeline on code changes.

### 1.2 Continuous Integration/Continuous Deployment (CI/CD)
**Tool:** GitHub Actions  
**Version:** Actions v3-v4  
**Purpose:** Automates the deployment pipeline by detecting code changes pushed to the main branch and orchestrating the deployment workflow. Provides integration with other DevOps tools and manages deployment secrets securely.

### 1.3 Infrastructure as Code (IaC)
**Tool:** Terraform  
**Version:** AWS Provider v5.100.0  
**Purpose:** Provisions and manages AWS cloud infrastructure declaratively. Automates the creation of EC2 instances, security groups, and network configurations, ensuring infrastructure consistency and repeatability.

### 1.4 Configuration Management
**Tool:** Ansible  
**Version:** 2.16+ (with Python 3.9.18)  
**Purpose:** Automates server configuration, software installation, and application deployment. Handles environment setup, Docker installation, dependency management, and application orchestration on the target EC2 instance.

### 1.5 Containerization Platform
**Tool:** Docker  
**Version:** Docker Engine (latest), Docker Compose v2.24.7  
**Purpose:** Containerizes the application components (frontend, backend, database) for consistent deployment across environments. Docker Compose orchestrates multi-container applications with defined networking and dependencies.

### 1.6 Cloud Provider
**Tool:** Amazon Web Services (AWS)  
**Service:** EC2 (Elastic Compute Cloud)  
**Instance Type:** t2.micro  
**Region:** ap-south-1 (Mumbai)  
**Purpose:** Provides the hosting infrastructure for running containerized applications with scalable compute resources.

---

## 2. Application Tools and Dependencies

### 2.1 Backend Application
- **Runtime:** Node.js (via Docker container)
- **Framework:** Express.js v5.1.0
- **Key Dependencies:**
  - `mongoose` v8.18.1 - MongoDB object modeling and database interaction
  - `jsonwebtoken` v9.0.2 - JWT-based authentication
  - `bcryptjs` v3.0.2 - Password hashing and encryption
  - `cors` v2.8.5 - Cross-Origin Resource Sharing middleware
- **Development Tools:**
  - `nodemon` v3.1.10 - Auto-restart during development

### 2.2 Frontend Application
- **Framework:** React v18.2.0
- **Build Tool:** React Scripts v5.0.1 (Create React App)
- **Routing:** React Router DOM v7.8.2
- **UI Components:** Lucide React v0.268.0 (icon library)
- **Styling:** Tailwind CSS v3.4.17
- **Testing Libraries:**
  - `@testing-library/react` v16.3.0
  - `@testing-library/jest-dom` v6.8.0
  - `@testing-library/user-event` v13.5.0

### 2.3 Database
- **Database System:** MongoDB v7
- **Container Image:** mongo:7 (official Docker image)
- **Purpose:** NoSQL document database for storing user data, transactions, goals, and settings

### 2.4 Web Server (Frontend)
- **Web Server:** Nginx (via Docker container)
- **Purpose:** Serves the React production build as static files and handles HTTP requests on port 80 (mapped to host port 8081)

### 2.5 Infrastructure Dependencies
- **Operating System:** Amazon Linux 2
- **Python:** v3.9.18 (compiled from source for Ansible compatibility)
- **System Packages:**
  - `gcc`, `openssl-devel`, `bzip2-devel`, `libffi-devel`, `zlib-devel` - Python compilation dependencies
  - `git` - Repository cloning
  - `docker` - Container runtime

---

## 3. Application Deployment Automation

### 3.1 Overall Automation Strategy
The BudgetBuddy application deployment follows a fully automated approach using Infrastructure as Code (IaC) and Configuration Management principles. The deployment is triggered automatically on every code push to the main branch, eliminating manual intervention and ensuring consistent, repeatable deployments.

### 3.2 Deployment Pipeline Stages

#### **Stage 1: Infrastructure Provisioning (Terraform)**
- **Trigger:** Manual execution (`terraform apply`)
- **Actions:**
  1. Provisions AWS EC2 t2.micro instance in ap-south-1 region
  2. Creates security group with inbound rules for:
     - SSH (port 22)
     - HTTP (port 80)
     - HTTPS (port 443)
     - Backend API (port 5000)
     - Frontend (port 8081)
     - MongoDB (port 27017)
  3. Configures SSH key pair for secure access
  4. Executes user_data script to install Docker, Git, and Python3
- **Output:** EC2 instance public IP address and security group ID
- **State Management:** Terraform state stored locally (terraform.tfstate)

#### **Stage 2: Code Commit and Push**
- **Trigger:** Developer commits code changes to local Git repository
- **Actions:**
  1. Developer makes code changes (e.g., frontend components, backend APIs)
  2. Git commit with descriptive message
  3. Git push to GitHub repository (main branch)
- **Output:** Code changes reflected in GitHub repository

#### **Stage 3: CI/CD Pipeline Initialization (GitHub Actions)**
- **Trigger:** Push event to main branch detected by GitHub
- **Runner:** Ubuntu-latest (GitHub-hosted runner)
- **Actions:**
  1. **Checkout Code:** Clones the repository to the runner environment
  2. **Set up Python:** Installs Python 3.x for Ansible execution
  3. **Install Ansible:** Installs Ansible via pip with latest version
  4. **Install Ansible Collections:** Installs `community.docker` collection for Docker module support

#### **Stage 4: SSH Authentication Setup**
- **Actions:**
  1. Creates `.ssh` directory in runner home
  2. Retrieves EC2 SSH private key from GitHub Secrets (`EC2_SSH_KEY`)
  3. Writes private key to `~/.ssh/budgetbuddy-key.pem`
  4. Sets proper file permissions (chmod 600) for security
  5. Creates symbolic link for Ansible compatibility
- **Security:** Private keys never exposed in logs or code

#### **Stage 5: Configuration Management (Ansible)**
**Phase 5.1: Bootstrap Python Environment**
- **Playbook:** Bootstrap play in `ansible/deploy.yml`
- **Target:** EC2 instance (defined in `ansible/inventory.ini`)
- **Actions:**
  1. Checks if Python 3.9 is already installed
  2. If not present, downloads Python 3.9.18 source from python.org
  3. Compiles Python from source with optimization flags
  4. Installs Python 3.9 to `/usr/local/bin/python3.9`
  5. Creates symbolic links for system-wide access
- **Rationale:** Amazon Linux 2 ships with Python 3.7, but Ansible 2.16+ requires Python 3.9+

**Phase 5.2: Application Deployment**
- **Playbook:** Main play in `ansible/deploy.yml`
- **Python Interpreter:** `/usr/local/bin/python3.9`
- **Actions:**
  1. **System Update:** Updates all system packages via yum
  2. **Dependency Installation:** Installs Docker and Git packages
  3. **Docker Setup:**
     - Installs Docker SDK for Python via pip
     - Starts and enables Docker service
     - Adds ec2-user to docker group for non-root access
  4. **Docker Compose Installation:**
     - Downloads Docker Compose binary v2.24.7 from GitHub releases
     - Installs to `/usr/local/bin/docker-compose` with execute permissions
  5. **Application Setup:**
     - Creates application directory at `/opt/budgetbuddy`
     - Clones/updates GitHub repository to application directory
     - Creates `.env` file with environment variables (JWT secret, ports)
  6. **Container Orchestration:**
     - Stops any existing containers
     - Pulls latest Docker images
     - Starts all services via `docker-compose up -d`
  7. **Health Check:**
     - Waits for backend API to respond on `/api/health` endpoint
     - Retries up to 30 times with 10-second delays
  8. **Systemd Service:**
     - Creates systemd service for auto-start on reboot
     - Enables the service for automatic startup

#### **Stage 6: Container Rebuild (GitHub Actions)**
- **Trigger:** Successful completion of Ansible deployment
- **Actions:**
  1. SSH into EC2 instance using private key
  2. Navigate to application directory (`/opt/budgetbuddy`)
  3. Stop all running containers (`docker-compose down`)
  4. Rebuild and restart containers with latest code (`docker-compose up -d --build`)
- **Purpose:** Ensures containers are using the latest code changes from the GitHub push

#### **Stage 7: Service Verification**
- **Automatic Checks:**
  1. Frontend accessible at `http://52.66.248.9:8081`
  2. Backend API responding at `http://52.66.248.9:5000/api/health`
  3. MongoDB accepting connections on port 27017
  4. Container health checks passing (configured in docker-compose.yml)
- **Manual Verification:** Developers can access the application via browser and test functionality

### 3.3 Docker Compose Service Architecture

#### **Service 1: MongoDB Database**
- **Image:** mongo:7
- **Port Mapping:** 27017:27017
- **Health Check:** Uses `mongosh` shell to ping database every 30 seconds
- **Data Persistence:** Volume mount at `/data/db` for data durability
- **Purpose:** Persistent data storage for application

#### **Service 2: Backend API**
- **Build Context:** `./back` directory with custom Dockerfile
- **Port Mapping:** 5000:5000
- **Environment Variables:**
  - `MONGO_URI`: Connection string to MongoDB service
  - `JWT_SECRET`: Secret key for token generation
  - `NODE_ENV`: Set to production
- **Dependencies:** Waits for MongoDB health check before starting
- **Health Check:** Wget request to `/api/health` endpoint every 30 seconds
- **Restart Policy:** `unless-stopped` for automatic recovery

#### **Service 3: Frontend Web Application**
- **Build Context:** `./front` directory with custom Dockerfile and Nginx configuration
- **Port Mapping:** 8081:80 (configurable via `FRONTEND_PORT` environment variable)
- **Environment Variables:**
  - `REACT_APP_BACKEND_URL`: Backend API service endpoint
- **Purpose:** Serves production-optimized React application via Nginx

### 3.4 Deployment Workflow Summary

```
Developer Push → GitHub Detects Change → GitHub Actions Triggered
     ↓
Install Ansible & Dependencies → Set Up SSH Authentication
     ↓
Ansible Playbook Execution:
   • Bootstrap Python 3.9 on EC2
   • Install Docker & Docker Compose
   • Clone Latest Code from GitHub
   • Configure Environment Variables
   • Start Docker Compose Services
     ↓
Container Rebuild:
   • SSH to EC2 Instance
   • Stop Existing Containers
   • Build Fresh Images with Latest Code
   • Start New Containers
     ↓
Verification:
   • Health Checks Pass
   • Application Accessible
   • Deployment Complete
```

### 3.5 Key Automation Benefits
1. **Zero Manual Intervention:** Entire deployment from code push to live application is automated
2. **Consistency:** Every deployment follows the same standardized process
3. **Rollback Capability:** Git version control enables quick reversion to previous stable versions
4. **Idempotency:** Ansible ensures configuration tasks can be run multiple times without adverse effects
5. **Infrastructure as Code:** Terraform state enables infrastructure versioning and collaboration
6. **Containerization:** Docker ensures application runs identically across development and production environments
7. **Secret Management:** Sensitive data (SSH keys, JWT secrets) stored securely in GitHub Secrets
8. **Automated Health Checks:** Built-in verification ensures services are healthy before marking deployment successful

---

## 4. Deployment Environment Details

- **Production URL:** http://52.66.248.9:8081
- **API Endpoint:** http://52.66.248.9:5000
- **EC2 Instance ID:** i-09c75b907ffc0da58
- **Security Group:** sg-0db756b90b8143bd1
- **GitHub Repository:** github.com/Mesit-Rathnayake/budgetbuddy
- **Deployment Method:** Fully automated CI/CD pipeline with zero downtime during updates
