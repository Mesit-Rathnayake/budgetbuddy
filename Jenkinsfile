pipeline {
    agent any

    triggers {
        // Trigger on develop branch commits (separate from GitHub Actions on main)
        githubPush()
    }

    options {
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // 30 minute timeout
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out code from develop branch..."
                checkout scm
            }
        }

        stage('Docker Hub Login') {
            steps {
                echo "🔐 Logging in to Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building backend image..."
                sh 'docker build -t mesith30/budgetbuddy-backend:latest ./back'

                echo "🐳 Building frontend image..."
                sh 'docker build -t mesith30/budgetbuddy-frontend:latest ./front'
            }
        }

        stage('Push Docker Images') {
            steps {
                echo "📤 Pushing images to Docker Hub..."
                sh 'docker push mesith30/budgetbuddy-backend:latest'
                sh 'docker push mesith30/budgetbuddy-frontend:latest'
            }
        }

        stage('Deploy via Ansible') {
            steps {
                echo "🚀 Deploying to EC2 via Ansible..."
                sh 'ansible-playbook -i ansible/inventory.ini ansible/deploy.yml'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline executed successfully!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs above."
        }
        always {
            echo "📊 Pipeline finished!"
        }
    }
}
