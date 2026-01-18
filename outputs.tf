# Additional outputs for better monitoring
output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.budgetbuddy_server.id
}

output "instance_state" {
  description = "State of the EC2 instance"
  value       = aws_instance.budgetbuddy_server.instance_state
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.budgetbuddy_sg.id
}

output "deployment_info" {
  description = "Complete deployment information"
  value = <<-EOT
  
  ========================================
  🎉 BudgetBuddy Deployment Complete!
  ========================================
  
  Frontend URL:    ${aws_instance.budgetbuddy_server.public_ip}:8081
  Backend API:     ${aws_instance.budgetbuddy_server.public_ip}:5000
  Status Page:     ${aws_instance.budgetbuddy_server.public_ip}/status.html
  
  SSH Access:      ssh ec2-user@${aws_instance.budgetbuddy_server.public_ip}
  Instance ID:     ${aws_instance.budgetbuddy_server.id}
  Region:          ${var.aws_region}
  
  ⚠️  Note: Wait 3-5 minutes after deployment for Docker containers to start
  
  EOT
}
