provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region for deployment"
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "key_name" {
  description = "SSH key name for EC2 access"
  type        = string
  default     = ""
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# Security Group
resource "aws_security_group" "budgetbuddy_sg" {
  name        = "budgetbuddy-sg"
  description = "Security group for BudgetBuddy application"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr
    description = "SSH access"
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Backend API (Node.js)
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend API"
  }

  # Frontend (React)
  ingress {
    from_port   = 8081
    to_port     = 8081
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Frontend application"
  }

  # MongoDB
  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "MongoDB database"
  }

  # All outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = {
    Name        = "BudgetBuddy-SG"
    Project     = "BudgetBuddy"
    Environment = "Production"
  }
}

# Find the latest Amazon Linux 2 Free Tier AMI dynamically in ap-south-1
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# EC2 Instance for BudgetBuddy
resource "aws_instance" "budgetbuddy_server" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_name != "" ? var.key_name : null
  security_groups = [aws_security_group.budgetbuddy_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              set -e
              
              # Update system
              sudo yum update -y
              
              # Install Docker
              sudo yum install -y docker
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ec2-user
              
              # Install Docker Compose
              sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              
              # Install Git
              sudo yum install -y git
              
              # Create app directory
              sudo mkdir -p /opt/budgetbuddy
              cd /opt/budgetbuddy
              
              # Clone the repository
              sudo git clone https://github.com/Mesit-Rathnayake/budgetbuddy.git .
              
              # Set environment variables
              echo "JWT_SECRET=your-super-secret-jwt-key-change-this" | sudo tee .env
              echo "FRONTEND_PORT=8081" | sudo tee -a .env
              
              # Start the application
              sudo docker-compose up -d
              
              # Setup systemd service for auto-start
              sudo cat > /etc/systemd/system/budgetbuddy.service <<SERVICE
              [Unit]
              Description=BudgetBuddy Application
              Requires=docker.service
              After=docker.service
              
              [Service]
              Type=oneshot
              RemainAfterExit=yes
              WorkingDirectory=/opt/budgetbuddy
              ExecStart=/usr/local/bin/docker-compose up -d
              ExecStop=/usr/local/bin/docker-compose down
              
              [Install]
              WantedBy=multi-user.target
              SERVICE
              
              sudo systemctl enable budgetbuddy.service
              
              # Create status page
              sudo mkdir -p /var/www/html
              sudo cat > /var/www/html/status.html <<HTML
              <!DOCTYPE html>
              <html>
              <head>
                  <title>BudgetBuddy Server Status</title>
                  <style>
                      body { font-family: Arial, sans-serif; margin: 40px; background: #f0f0f0; }
                      .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                      h1 { color: #2c3e50; }
                      .status { padding: 15px; margin: 10px 0; border-radius: 5px; }
                      .running { background: #d4edda; color: #155724; }
                      a { color: #007bff; text-decoration: none; }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h1>🚀 BudgetBuddy Deployment Status</h1>
                      <div class="status running">
                          ✅ Server is running and configured
                      </div>
                      <h2>Access Points:</h2>
                      <ul>
                          <li><a href="http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8081" target="_blank">Frontend Application (Port 8081)</a></li>
                          <li><a href="http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000/api/health" target="_blank">Backend API Health (Port 5000)</a></li>
                      </ul>
                      <p><strong>Deployed by:</strong> Mesith using Terraform</p>
                      <p><strong>Deployment Date:</strong> $(date)</p>
                  </div>
              </body>
              </html>
              HTML
              
              # Install and configure nginx for status page
              sudo yum install -y nginx
              sudo systemctl start nginx
              sudo systemctl enable nginx
              EOF

  tags = {
    Name        = "BudgetBuddy-Server"
    Project     = "BudgetBuddy"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

# Outputs
output "server_public_ip" {
  description = "Public IP address of the BudgetBuddy server"
  value       = aws_instance.budgetbuddy_server.public_ip
}

output "frontend_url" {
  description = "URL to access the frontend application"
  value       = "http://${aws_instance.budgetbuddy_server.public_ip}:8081"
}

output "backend_api_url" {
  description = "URL to access the backend API"
  value       = "http://${aws_instance.budgetbuddy_server.public_ip}:5000"
}

output "status_page_url" {
  description = "URL to access the deployment status page"
  value       = "http://${aws_instance.budgetbuddy_server.public_ip}/status.html"
}

output "ssh_command" {
  description = "SSH command to connect to the server"
  value       = var.key_name != "" ? "ssh -i ${var.key_name}.pem ec2-user@${aws_instance.budgetbuddy_server.public_ip}" : "Key name not provided"
}
