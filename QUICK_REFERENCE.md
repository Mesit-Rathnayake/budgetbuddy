# 🚀 BudgetBuddy DevOps Quick Reference

## Quick Commands Cheatsheet

### Docker Compose
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Clean everything
docker-compose down -v --remove-orphans
```

### Terraform
```bash
# Initialize
terraform init

# Plan
terraform plan

# Apply
terraform apply -auto-approve

# Destroy
terraform destroy -auto-approve

# Show outputs
terraform output

# Format code
terraform fmt

# Validate
terraform validate
```

### Ansible
```bash
# Test connection
ansible -i ansible/inventory.ini budgetbuddy -m ping

# Deploy application
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml

# Health check
ansible-playbook -i ansible/inventory.ini ansible/health-check.yml

# Run with verbose output
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml -vvv

# Check syntax
ansible-playbook ansible/deploy.yml --syntax-check
```

### Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Get all resources
kubectl get all -n budgetbuddy

# Get pods
kubectl get pods -n budgetbuddy

# Get services
kubectl get svc -n budgetbuddy

# Describe pod
kubectl describe pod <pod-name> -n budgetbuddy

# View logs
kubectl logs -f <pod-name> -n budgetbuddy

# Execute command in pod
kubectl exec -it <pod-name> -n budgetbuddy -- /bin/sh

# Port forward
kubectl port-forward svc/frontend-service 8081:80 -n budgetbuddy

# Scale deployment
kubectl scale deployment backend --replicas=3 -n budgetbuddy

# Delete all resources
kubectl delete namespace budgetbuddy
```

### Git
```bash
# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# Check status
git status

# View changes
git diff
```

## Common Workflows

### 1. Local Development Setup
```bash
# Clone repository
git clone https://github.com/Mesit-Rathnayake/budgetbuddy.git
cd budgetbuddy

# Create environment file
echo "JWT_SECRET=dev-secret-key" > .env

# Start application
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Deploy to AWS with Terraform
```bash
# Configure AWS credentials
aws configure

# Initialize Terraform
terraform init

# Deploy
terraform apply

# Get server IP
terraform output server_public_ip

# SSH into server
ssh ec2-user@<SERVER_IP>
```

### 3. Configure Server with Ansible
```bash
# Update inventory with server IP
nano ansible/inventory.ini

# Deploy application
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml

# Verify deployment
ansible-playbook -i ansible/inventory.ini ansible/health-check.yml
```

### 4. Deploy to Kubernetes
```bash
# Set context (if multiple clusters)
kubectl config use-context <cluster-name>

# Deploy application
kubectl apply -f k8s/

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=backend -n budgetbuddy --timeout=300s

# Get service URL (for LoadBalancer)
kubectl get svc frontend-service -n budgetbuddy
```

## URLs After Deployment

### Local (Docker Compose)
- Frontend: http://localhost:8081
- Backend: http://localhost:5000
- Backend Health: http://localhost:5000/api/health

### AWS (Terraform)
- Check `terraform output` for URLs
- Frontend: http://<SERVER_IP>:8081
- Backend: http://<SERVER_IP>:5000

### Kubernetes
- Check with: `kubectl get svc -n budgetbuddy`
- Use LoadBalancer external IP or NodePort

## Troubleshooting Quick Fixes

### Docker Issues
```bash
# Remove all containers
docker rm -f $(docker ps -aq)

# Remove all volumes
docker volume prune -f

# Remove all networks
docker network prune -f

# Clean everything
docker system prune -af --volumes
```

### Port Already in Use
```bash
# Find process using port
lsof -i :8081
# or on Windows
netstat -ano | findstr :8081

# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues
```bash
# Check MongoDB logs
docker logs myapp-mongo

# Test MongoDB connection
docker exec -it myapp-mongo mongosh --eval "db.adminCommand({ ping: 1 })"
```

## Environment Variables Reference

Create `.env` file:
```bash
JWT_SECRET=your-super-secret-key
FRONTEND_PORT=8081
MONGO_URI=mongodb://mongo:27017/budget-tracker
NODE_ENV=production
```

## Health Check Endpoints

```bash
# Backend health
curl http://localhost:5000/api/health

# MongoDB health
docker exec myapp-mongo mongosh --eval "db.adminCommand({ ping: 1 })"

# Check all containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## Resource Cleanup

### Complete Cleanup
```bash
# Stop Docker Compose
docker-compose down -v

# Destroy Terraform infrastructure
terraform destroy -auto-approve

# Delete Kubernetes resources
kubectl delete namespace budgetbuddy

# Clean Docker system
docker system prune -af --volumes
```

## Monitoring Commands

```bash
# Docker stats
docker stats

# Kubernetes resources
kubectl top pods -n budgetbuddy
kubectl top nodes

# System resources (Linux)
htop
df -h
free -h
```

## Backup Commands

```bash
# Backup MongoDB
docker exec myapp-mongo mongodump --out=/backup --db=budget-tracker

# Copy backup from container
docker cp myapp-mongo:/backup ./mongo-backup

# Restore MongoDB
docker exec myapp-mongo mongorestore /backup
```

## Quick Tips

1. **Always check logs first**: `docker-compose logs -f` or `kubectl logs -f <pod>`
2. **Use health checks**: Verify services are responding before debugging
3. **Check connectivity**: Ensure ports are open and services can communicate
4. **Update secrets**: Never use default secrets in production
5. **Monitor resources**: Keep an eye on CPU, memory, and disk usage

---

For detailed documentation, see [DEPLOYMENT.md](DEPLOYMENT.md)
