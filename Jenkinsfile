pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        PROJECT_NAME = 'budgetbuddy'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Mesit-Rathnayake/budgetbuddy.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker compose -f ${COMPOSE_FILE} build'
            }
        }

        stage('Deploy to Server') {
            steps {
                echo 'Deploying containers...'
                // Stop any old containers (if exist)
                sh 'docker compose -f ${COMPOSE_FILE} down || true'
                // Start everything fresh
                sh 'docker compose -f ${COMPOSE_FILE} up -d'
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Checking app health...'
                    // Simple check: wait a few seconds and ensure containers are up
                    sh 'sleep 10'
                    sh 'docker ps'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful! Your app is live and running.'
        }
        failure {
            echo '❌ Deployment failed. Please check Jenkins logs for details.'
        }
    }
}
